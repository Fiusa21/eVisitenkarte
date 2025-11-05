const express = require('express')();
const app = express;

// Test route
app.get('/', (req, res) => {
    res.send('<h1>Hi, this is the Express.js Server! </h1>');
});

app.listen(3000, function(){
    console.log("Server started");
})