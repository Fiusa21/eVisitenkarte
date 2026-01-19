const Pool = require('pg-pool')
require('dotenv').config();

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
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
        
        //Use client.query with parameters for safety (prevents SQL injection)
        const result = await client.query(sqlText, params);
        
        return result.rows;
    } catch (err) {
        console.error('Database query error:', err.stack);
        throw new Error('Database query failed.');
    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = {
    executeQuery,
    pool
};