const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const conn = require('./database.js');

const PORT = 3000; 
const app = express();

app.use(express.json());


app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    if (username != '' && password != '') {
        try {
            const result = await conn.query('SELECT * FROM app_users WHERE username = $1', [username]);
            if (result.rowCount === 1) {
                res.status(409).json({message: 'User already exists!'});
                return;
            }
            // Hashing the password for security
            const saltRounds = 5;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const newUser = await conn.query('INSERT INTO app_users (username, password) VALUES ($1, $2) RETURNING *', [username, passwordHash]);
            res.status(201).json({message: 'User Created Successfully', user: newUser.rows[0]});
            return;
        } catch(error) {
            console.error(error.message);
            res.status(500).json({message:'Internal Server Error'})
        }        
    }
    res.status(400).json({message: 'Enter valid Username and Password!'});
})



app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})

