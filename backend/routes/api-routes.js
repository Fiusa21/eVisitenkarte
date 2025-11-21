
const express = require('express');
const { protect } = require('../middleware/keycloak-middleware'); // Import protect middleware

const router = express.Router();

//FOR DOCUMENTATION see /docs/api-docs
//ALWAYS UPDATE IF YOU ADD OR MODIFY OR DELETE AN ENDPOINT

//basic route testing
router.get('/protected', protect, (req, res) => {
    // If we reach here, the request is authenticated
    const username = req.kauth.grant.access_token.content.preferred_username;
    const company = req.kauth.grant.access_token.content.company;
    res.json({ message: `Hello, ${username}! You accessed a protected API. Your company is ${company}` });
});

router.post('/protected', protect, (req, res) => {
    // If we reach here, the request is authenticated
    const username = req.kauth.grant.access_token.content.preferred_username;
    const company = req.kauth.grant.access_token.content.company;
    res.json({ message: `Hello, ${username}! You accessed a protected API. Your company is ${company}` });
});

router.get('/user', protect,(req, res)=>{
    const userData= req.kauth.grant.access_token.content;
    res.json(userData);
})

router.get('/layout-management/layouts', protect, (req, res) => {
    res.json('placeholder');
})

router.get('/layout-management/layouts/{id}', protect, (req, res) => {
    res.json('placeholder');
})

router.post('/layout-management/layouts/{id}', protect, (req, res)=> {
    res.json('placeholder');
})

router.put('/layout-management/layouts/{id}', protect, (req, res)=> {
    res.json('placeholder');
})

router.delete('/layout-management/layouts/{id}', protect, (req, res)=> {
    res.json('placeholder');
})

router.get('/layout-management/layouts/{id}/elements', protect, (req, res) => {
    res.json('placeholder');
})

router.post('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder');
})

router.put('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder');
})

router.delete('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder');
})





module.exports = router;