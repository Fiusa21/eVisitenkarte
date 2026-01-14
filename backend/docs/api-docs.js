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
 * tags:
 *   - name: Layout Management
 *     description: Operations regarding screen layouts
 *   - name: Device
 *     description: Hardware interaction and status
 */

/**
 * @swagger
 * /layout-management/layouts:
 *   get:
 *     summary: Retrieve all layouts
 *     description: Fetches a list of all layouts from the database. Protected by Keycloak.
 *     tags: [Layout Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of layouts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   user_id_ersteller:
 *                     type: string
 *                   erstelldatum:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /layout-management/layouts:
 *   post:
 *     summary: Create a new layout
 *     description: Saves a new layout and its associated elements. User ID is extracted from the Keycloak token.
 *     tags: [Layout Management]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *                 example: "New Exhibition Layout"
 *               elements:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/LayoutElement'
 *     responses:
 *       201:
 *         description: Layout created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 layout_id:
 *                   type: integer
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /layout-management/layouts/{id}:
 *   put:
 *     summary: Update an existing layout
 *     description: Updates layout details and replaces its elements.
 *     tags: [Layout Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The layout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               elements:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/LayoutElement'
 *     responses:
 *       200:
 *         description: Layout updated successfully.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /layout-management/layouts/{id}:
 *   delete:
 *     summary: Delete a layout
 *     tags: [Layout Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Layout deleted.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /device/status:
 *   get:
 *     summary: Check Raspberry Pi connection
 *     description: Checks if the device service is reachable.
 *     tags: [Device]
 *     responses:
 *       200:
 *         description: Device is online.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "online"
 *                 message:
 *                   type: string
 *       503:
 *         description: Device is offline.
 */

/**
 * @swagger
 * /display/upload:
 *   post:
 *     summary: Upload image to display
 *     description: Sends raw binary image data to the Raspberry service.
 *     tags: [Device]
 *     requestBody:
 *       description: Binary image data (PNG/JPG)
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *       400:
 *         description: No image data provided.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     LayoutElement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "element-1"
 *         type:
 *           type: string
 *           example: "image"
 *         content:
 *           type: string
 *           example: "https://example.com/img.png"
 *         x:
 *           type: integer
 *           example: 0
 *         y:
 *           type: integer
 *           example: 0
 *         w:
 *           type: integer
 *           example: 4
 *         h:
 *           type: integer
 *           example: 2
 *         source:
 *           type: string
 *           example: "internal"
 *         style:
 *           type: object
 *           example: { "backgroundColor": "red" }
 */