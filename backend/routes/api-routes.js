
const express = require('express');
const { protect } = require('../middleware/keycloak-middleware'); // Import protect middleware

const router = express.Router();

//basic route testing
router.get('/protected', protect, (req, res) => {
    // If we reach here, the request is authenticated
    const username = req.kauth.grant.access_token.content.preferred_username;
    const company = req.kauth.grant.access_token.content.company;
    res.json({ message: `Hello, ${username}! You accessed a protected API. Your company is ${company}` });
});

// You can add other public or protected routes here
router.get('/public', (req, res) => {
    res.json({ message: 'This is a public API endpoint.' });
});



module.exports = router;