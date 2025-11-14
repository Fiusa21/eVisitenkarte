// server.js
const express = require('express');
const cors = require('cors');
const { sessionMiddleware, keycloakMiddleware } = require('./middleware/keycloak-middleware');
const apiRoutes = require('./routes/api-routes');

const app = express();
const port = 3000;

// Enable CORS for your frontend origin
app.use(cors({ origin: 'http://localhost:5173' }));

// Apply Keycloak session and middleware
app.use(sessionMiddleware);
app.use(keycloakMiddleware);

//Mount API routes
app.use('/api', apiRoutes);

//check later
// Simple root endpoint
app.get('/', (req, res) => {
    res.send('Node.js Backend is running!');
});

app.get('/public', (req, res)=>{
    res.send('public endpoint available!');
});

// Start the server
app.listen(port, () => {
    console.log(`Modularized Backend server listening at http://localhost:${port}`);
});