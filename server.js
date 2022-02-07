// import exress
const express = require('express');

// import mysql2
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to mysql db
const db = mysql.createConnection (
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        // Your MySQL password
        password: '',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// runs query method, executes callback w/ all resulting rows that match the query
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});
// KEEP as LAST route prior to listen event; CATCHALL route; route to handle user requests that are not supported by the app; Default responses for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


// starts Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});