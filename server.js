// import exress
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// KEEP as LAST route prior to listen event; route to handle user requests that are not supported by the app; Default responses for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


// starts Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});