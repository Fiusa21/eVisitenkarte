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
 * /:
 *   get:
 *     summary: CHECK BACKEND RUNNING
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
 * /layout-management/layouts:
 *   post:
 *     summary: Insert a new layout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []           # This tells Swagger to require the 'Authorize' button
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - elements
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: "My Business Card"
 *               elements:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       format: int64
 *                       description: Unique ID generated by frontend (timestamp)
 *                       example: 1765038155609
 *                     type:
 *                       type: string
 *                       example: "text"
 *                     x:
 *                       type: number
 *                       example: 149
 *                     y:
 *                       type: number
 *                       example: 150
 *                     w:
 *                       type: number
 *                       example: 142.9
 *                     h:
 *                       type: number
 *                       example: 39
 *                     content:
 *                       type: string
 *                       example: "company"
 *                     source:
 *                       type: string
 *                       enum: [static, dynamic]
 *                       example: "dynamic"
 *                     style:
 *                       type: object
 *                       properties:
 *                         color:
 *                           type: string
 *                           example: "black"
 *
 *     responses:
 *       200:
 *         description: Successfully inserted
 *       500:
 *         description: Server error
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

/**
 * @swagger
 * /layout-management/layouts/{id}/elements:
 *   get:
 *     summary: retrieve all elements
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
 * /layout-management/layouts/{id}/elements/{id}:
 *   get:
 *     summary: retrieve a specific element
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
 * /layout-management/layouts/{id}/elements/{id}:
 *   post:
 *     summary: insert a new element
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
 * /layout-management/layouts/{id}/elements/{id}:
 *   put:
 *     summary: update a specific element
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
 * /layout-management/layouts/{id}/elements/{id}:
 *   delete:
 *     summary: delete a specfifc element
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
 *
 */

/**
 * @swagger
 * /device/status:
 *   get:
 *     summary: check wifi connection
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
 *                   example: Device is ready
 *       401:
 *         description: Unauthorized. The token is missing or invalid.
 *       403:
 *         description: Forbidden. The token is valid, but the user does not have permission to access this resource.
 *
 */