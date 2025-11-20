const express = require('express');
const cors = require('cors');
const { sessionMiddleware, keycloakMiddleware } = require('./middleware/keycloak-middleware');
const apiRoutes = require('./routes/api-routes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());
const port = 3000;

// Enable CORS for your frontend origin
//conditional: product or dev?
app.use(cors({ origin: 'http://localhost:5173' }));



// Apply Keycloak session and middleware
app.use(sessionMiddleware);
app.use(keycloakMiddleware);

//Mount API routes
app.use('/api', apiRoutes);

//SWAGGER CONFIG
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'eVisitenkarten API (from code)',
            version: '1.0.0',
            description: 'API for managing business cards, generated from JSDoc comments.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development Server',
            },
        ],
    },
    // Path to the API docs files that contain annotations
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

//for interactive api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', apiRoutes);

//check later
// Simple root endpoint; Visible when accessing localhost:3000
app.get('/', (req, res) => {
    res.send('Node.js Backend is running!');
});

app.get('/public', (req, res)=>{
    res.send('public endpoint available!');
});

// Start the server
app.listen(port, () => {
    console.log(`Modularized Backend server listening at http://localhost:${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
});