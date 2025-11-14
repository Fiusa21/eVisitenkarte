
const express = require('express');
const { protect } = require('../middleware/keycloak-middleware'); // Import protect middleware

const router = express.Router();

// Define a protected endpoint
router.get('/protected', protect, (req, res) => {
    // If we reach here, the request is authenticated
    const username = req.kauth.grant.access_token.content.preferred_username;
    res.json({ message: `Hello, ${username}! You accessed a protected API (modularized).` });
});

// You can add other public or protected routes here
router.get('/public', (req, res) => {
    res.json({ message: 'This is a public API endpoint.' });
});

module.exports = router;