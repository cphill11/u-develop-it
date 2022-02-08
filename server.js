// import exress
const express = require('express');

// import mysql2
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

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

// GET all candidates using express code as a wrap around db callback;uses API endpoint
app.get('/api/candidates', (req, res) => {
    // SQL statement assigned sql as variable
    const sql = `SELECT candidates.*, parties.name 
        AS party_name
        FROM candidates
        LEFT JOIN parties
        ON candidates.party_id = parties.id`;
    
    // db callback; runs query method, executes callback w/ all resulting rows that match the query 
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
       });
    });
});

// GET a single candidate; endpoint has a route paramter to hold id value
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
        AS party_name 
        FROM candidates 
        LEFT JOIN parties 
        ON candidates.party_id = parties.id 
        WHERE candidates.id = ?`;
        
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
       });
    });
});

// Delete a candidate; (?) denotes a placeholder (prepared statement)
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });

        // verify row exists in the first place (prior to deletion)
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

// Create a candidate using HTTP request method post() to insert candidate into candidate table
// object destructuring pulls body property out of request object (instead of simply using req param)
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
        // errors assigned to receive return from inputCheck fxn
        if (errors) {
            res.status(400).json({ error: errors });
            return;
        }
    // db call
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
            VALUES (?,?,?)`;
    
            const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});



// KEEP as LAST route prior to listen event; CATCHALL route; route to handle user requests that are not supported by the app; Default responses for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


// starts Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});