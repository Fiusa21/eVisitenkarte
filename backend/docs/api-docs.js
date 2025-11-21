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

/**
* @swagger
* /layout-management/layouts:
    *   get:
    *     summary: Access all layouts
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

/**
 * @swagger
 * /layout-management/layouts/{id}:
 *   get:
 *     summary: Access a specific layout
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

/**
 * @swagger
 * /layout-management/layouts/{id}:
 *   post:
 *     summary: Insert a new layout
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

/**
 * @swagger
 * /layout-management/layouts/{id}:
 *   put:
 *     summary: Update a specfifc layout
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

/**
 * @swagger
 * /layout-management/layouts/{id}:
 *   delete:
 *     summary: delete a specfifc layout
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