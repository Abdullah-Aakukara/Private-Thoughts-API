# 🔒 Private Thoughts API

A secure, RESTful Backend API built with Node.js and PostgreSQL. This application allows users to register, log in securely, and manage private notes that are protected by JWT Authentication.

## 🚀 Features

* **User Authentication:** Secure Registration and Login.
* **Security:**
    * Passwords hashed using `bcrypt` (Salt Rounds: 10).
    * JWT (JSON Web Tokens) for stateless authentication.
    * Protected Routes (Middleware) to prevent unauthorized access.
    * CORS enabled for frontend integration.
* **Database:**
    * PostgreSQL relational database.
    * One-to-Many relationship (Users -> Notes).
    * `ON DELETE CASCADE` implemented for data integrity.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Libraries:** `pg` (Postgres Client), `bcrypt`, `jsonwebtoken`, `dotenv`, `cors`.

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/private-thoughts-api.git](https://github.com/YOUR_USERNAME/private-thoughts-api.git)
    cd private-thoughts-api
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    * Make sure you have PostgreSQL installed.
    * Create a database named `private_thoughts_api`.
    * Run the following SQL commands to set up the tables:

    ```sql
    CREATE TABLE app_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
    );

    CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        description VARCHAR(100) NOT NULL,
        user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE
    );
    ```

4.  **Environment Variables**
    * Create a `.env` file in the root directory.
    * Add the following variables:

    ```env
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=private_thoughts_api
    JWT_SECRET=your_super_secret_key
    ```

5.  **Run the Server**
    ```bash
    npm start
    # or if using nodemon
    npm run dev
    ```

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | `{ "username": "ali", "password": "123" }` |
| `POST` | `/login` | Log in and get a Token | `{ "username": "ali", "password": "123" }` |

### Protected Routes (Requires Header: `Authorization: Bearer <token>`)

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/notes` | Create a private note | `{ "description": "Buy milk" }` |
| `GET` | `/notes` | Get all your notes | N/A |

## 👨‍💻 Author

**Abdullah Aakukara**
* Backend Developer
* LinkedIn Profile: https://www.linkedin.com/in/abdullah-aakukara

---
*This project was built to master Backend Engineering concepts including JWT Auth, Password Hashing, and Relational Database Design.*