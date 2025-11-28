const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const conn = require('./database.js');

const PORT = 3000; 
const app = express();

// req body parser
app.use(express.json());
app.use(cors());
    
// logger
app.use((req, res, next) => {
    console.log(`Got a request for ${req.method, req.originalUrl}!`);
    next();
})

// validation middleware
function validationMiddleware (req, res, next) {
    const {username, password} = req.body;
    if (!username || !password) {
       return res.status(400).json({
            message: 'Enter valid Username and Password!'
        })
    }
    console.log('Validation middleware processed!')
    next();
}

// authenticateMiddleware
function authenticateMiddleware (req, res, next) {
    const token = req.headers['authorization'].split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: 'Invalid/Missing Token!'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        console.error(error.message);
        return res.status(403).json({
            message: "You are not an authorized person!"
        })
    }
    next();
}

// register
app.post('/register', validationMiddleware, async (req, res) => {
    
    const {username, password} = req.body;

    try {
            const result = await conn.query('SELECT * FROM app_users WHERE username = $1', [username]);
            if (result.rowCount > 0) {
                res.status(409).json({message: 'User already exists!'});
                return;
            }
            // Hashing the password for security
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const newUser = await conn.query('INSERT INTO app_users (username, password) VALUES ($1, $2) RETURNING *', [username, passwordHash]);
            res.status(201).json({message: 'User Created Successfully', user: newUser.rows[0]});
            return;
    } catch(error) {
        console.error(error.message);
        return res.status(500).json({message:'Internal Server Error'})
    }        
});

// login 
app.post('/login', validationMiddleware, async (req, res) => {
    
    const {username, password, description} = req.body;

    try {
        // checking for user
        const result = await conn.query('SELECT * FROM app_users WHERE username = $1', [username]);

        if (!result.rowCount) {
            return res.status(401).json({
                message : 'Invalid Credentials !'
            })
        }
     
        const storedPass = result.rows[0].password;
        const passCheck = await bcrypt.compare(password, storedPass);
        if (!passCheck) {
            return res.status(401).json({
                 message : 'Invalid Credentials !' 
            })
        }
        req.user = result.rows[0];
        const payload = {
            userID : req.user.id, 
            username: req.user.username
        }
        // generating token for the user which acts like a VIP PASS/Proof that this person is Authentic
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '15 minutes' // 15 mins because since our app is intended for storing private & secret notes
        })
        
        res.status(200).json({
            message: `Welcome back ${req.user.username}`, 
            token : token
        })

    } catch(error) {
        console.error(error.message)
        res.status(500).json({
            message: "SERVER ERROR :( SOMETHING WENT WRONG!"
        })
    }   
    
})

// POST notes
app.post('/notes', authenticateMiddleware, async (req, res) => {
    const {description} = req.body;
    if(!description) {
        return res.status(400).json({
            message: "Please fill the description field!"
        })
    }
    
    try {
        const newNote = await conn.query('INSERT INTO notes(description, user_id) VALUES($1, $2) RETURNING *', [req.body.description,req.user.userID]);
        res.status(201).json({
            message: "New Note Created!",
            note: newNote.rows[0]
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error!"
        })
    }
})

// GET notes
app.get('/notes', authenticateMiddleware, async (req, res) => {
    try{
        const notes = await conn.query('SELECT * FROM notes WHERE user_id = $1', [req.user.userID]);
        res.status(200).json({
            message: `Welcome back ${req.user.username}`,
            your_notes: notes.rows
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error! \n Try again after few minutes."
        })
    }
})



app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})

