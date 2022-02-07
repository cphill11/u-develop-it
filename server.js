// import exress
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express;

// Express middleware
app.use(expres.urlencoded({ extended: false }));
app.use(express.json());

// create GET test route
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

// starts Express.js server on port 3001
app.listener(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});