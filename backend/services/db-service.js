const Pool = require('pg-pool')
// --- PostgreSQL Setup ---
// The Pool will handle connection pooling for efficiency.
// It reads connection parameters from environment variables (e.g., PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT).
// PGPORT will default to 5432 if not explicitly set in the environment.
const pool = new Pool({
    // You can explicitly define connection details here, 
    // but using environment variables is preferred.
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'myuser',
    database: process.env.PGDATABASE || 'mydatabase',
    password: process.env.PGPASSWORD || 'mypassword!',
    port: process.env.PGPORT || 5432, // PostgreSQL default port
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

/**
 * Executes a SQL query against the PostgreSQL pool.
 * @param {string} sqlText - The SQL query string to execute.
 * @param {Array<any>} [params=[]] - Optional array of parameters for parameterized query protection.
 * @returns {Promise<Array<any>>} - A promise that resolves to an array of result rows.
 */
async function executeQuery(sqlText, params = []) {
    let client;
    try {
        client = await pool.connect();
        
        // Use client.query with parameters for safety (prevents SQL injection)
        const result = await client.query(sqlText, params);
        
        return result.rows;
    } catch (err) {
        console.error('Database query error:', err.stack);
        throw new Error('Database query failed.'); // Re-throw a generic error
    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = {
    executeQuery,
    pool // Optional: export pool if other files need to connect/close/manage it
};