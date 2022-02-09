const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET route for voters (performs SELECT * FROM voters)
router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});

module.exports = router;