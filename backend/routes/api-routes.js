
const express = require('express');
const { protect } = require('../middleware/keycloak-middleware');// Import protect middleware

const router = express.Router();
const layoutModel = require ('../models/query-model');
const RaspberryService = require('../services/raspberry-service');

//FOR DOCUMENTATION see /docs/api-docs
//ALWAYS UPDATE IF YOU ADD OR MODIFY OR DELETE AN ENDPOINT

//basic route testing
router.get('/', protect, (req, res) => {
    res.json('Node.js Backend is running!');
});

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

router.get('/layout-management/layouts', protect, async (req, res) => {
    try {
        const layouts = await layoutModel.getAllLayouts();
        res.json(layouts);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get('/layout-management/layouts/{id}', protect, (req, res) => {
    res.json('placeholder: thist would retrieve a specific layout');
})

router.post('/layout-management/layouts', protect, async (req, res) => {
    try {
        const userId = req.kauth.grant.access_token.content.sub;

        //destructure
        const { name, elements } = req.body;

        const layoutData = {
            name: name,
            user_id_ersteller: userId,
            erstelldatum: new Date()
        };

        const newLayoutId = await layoutModel.createLayoutWithElements(layoutData, elements);

        res.status(201).json({
            message: 'Layout created',
            layout_id: newLayoutId
        });
    } catch (err) {
        console.error("Error saving layout:", err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/layout-management/layouts/:id', protect, async (req, res) => {
    try {
        const userId = req.kauth.grant.access_token.content.sub;
        const { id } = req.params;
        const { name, elements } = req.body;

        const layoutData = {
            id: id,
            name: name,
            user_id_ersteller: userId,
            erstelldatum: new Date() // Usually you update the "last modified" or keep original
        };

        await layoutModel.updateLayoutWithElements(layoutData, elements);

        res.json({ message: 'Layout updated successfully', layout_id: id });
    } catch (err) {
        console.error("Error updating layout:", err);
        res.status(500).json({ error: err.message });
    }



})

router.delete('/layout-management/layouts/:id', protect, async (req, res)=> {
    try {
        const { id } = req.params;
        await layoutModel.deleteLayout(id)

        res.json({message: 'Layout deleted successfully', layout_id: id});
    } catch (err){
        console.error("Error deleting layout:", err);
        res.status(500).json({ error: err.message });
    }
})


router.get('/layout-management/layouts/{id}/elements', protect, (req, res) => {
    res.json('placeholder: this would retreive all elements');
})

router.get('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder: this would retreive a specific element');
})

router.post('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder: this would insert a new element');
})

router.put('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder: this would update an element');
})

router.delete('/layout-management/layouts/{id}/elements/{id}', protect, (req, res) => {
    res.json('placeholder: this would delete a elements');
})

//DEVICE HANDLING
router.get('/device/status', async (req, res) => {
    const isOnline = await RaspberryService.checkConnection();

    if (isOnline) {
        res.json({ status: 'online', message: 'Device is ready' });
    } else {
        res.status(503).json({ status: 'offline', message: 'Check Wifi connection' });
    }
});



module.exports = router;