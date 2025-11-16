
const express = require('express');
const { protect } = require('../middleware/keycloak-middleware'); // Import protect middleware

const router = express.Router();

// --- SWAGGER DEFINITIONS ---

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Enter the Bearer token issued by Keycloak. Example: 'Bearer a1b2c3d4...'"
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Routes for testing public vs protected access
 */

// --- ROUTES ---

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access a protected route
 *     description: This endpoint is protected by Keycloak. You must provide a valid Bearer token in the Authorization header.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated and accessed the resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello, testuser! You accessed a protected API. Your company is ExampleCorp"
 *       401:
 *         description: Unauthorized. The token is missing or invalid.
 *       403:
 *         description: Forbidden. The token is valid, but the user does not have permission to access this resource.
 */

//basic route testing
router.get('/protected', protect, (req, res) => {
    // If we reach here, the request is authenticated
    const username = req.kauth.grant.access_token.content.preferred_username;
    const company = req.kauth.grant.access_token.content.company;
    res.json({ message: `Hello, ${username}! You accessed a protected API. Your company is ${company}` });
});

/**
 * @swagger
 * /protected:
 *   post:
 *     summary: Access a protected route
 *     description: This endpoint is protected by Keycloak. You must provide a valid Bearer token in the Authorization header.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated and accessed the resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello, testuser! You accessed a protected API. Your company is ExampleCorp"
 *       401:
 *         description: Unauthorized. The token is missing or invalid.
 *       403:
 *         description: Forbidden. The token is valid, but the user does not have permission to access this resource.
 */

router.post('/protected', protect, (req, res) => {
    // If we reach here, the request is authenticated
    const username = req.kauth.grant.access_token.content.preferred_username;
    const company = req.kauth.grant.access_token.content.company;
    res.json({ message: `Hello, ${username}! You accessed a protected API. Your company is ${company}` });
});

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Access user data
 *     description: This endpoint is protected by Keycloak. You must provide a valid Bearer token in the Authorization header.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated and accessed the resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: YourUsername
 *       401:
 *         description: Unauthorized. The token is missing or invalid.
 *       403:
 *         description: Forbidden. The token is valid, but the user does not have permission to access this resource.
 */
router.get('/user', (req, res)=>{
    const username = req.kauth.grant.access_token.content.preferred_username;
    //add required attributes here!!!!
    res.json(username);
})

/**
 * @swagger
 * /public:
 *   get:
 *     summary: Access a public route
 *     description: This endpoint is public and requires no authentication.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully accessed the public resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This is a public API endpoint."
 */

// You can add other public or protected routes here
router.get('/public', (req, res) => {
    res.json({ message: 'This is a public API endpoint.' });
});



module.exports = router;