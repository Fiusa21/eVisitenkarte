// --- PostgreSQL Setup ---
// The Pool will handle connection pooling for efficiency.
// It reads connection parameters from environment variables (e.g., PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT).
// PGPORT will default to 5432 if not explicitly set in the environment.
const pool = new Pool({
    // You can explicitly define connection details here, 
    // but using environment variables is preferred.
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'myuser',
    database: process.env.PGDATABASE || 'mydatabase!',
    password: process.env.PGPASSWORD || 'mypassword',
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
async function executeQuery(sqlCommand, params = []) {
    let client;
    try {
        client = await pool.connect();
        
        switch (sqlCommand) {
            case SELECT:
                sqlText = 'SELECT * FROM layouts LEFT JOIN elements ON layouts.layout_id = elements.layout_id';
                break;
             case SELECTID:
                sqlText = 'SELECT * FROM layouts LEFT JOIN elements ON layouts.layout_id = elements.layout_id WHERE layouts.layout_id = $1';
                break;
            case INSERTLAYOUT:
                sqlText = 'INSERT INTO layouts (layout_id, erstelldatum, user_id_ersteller, name) VALUES ($1, $2, $3 $4)';
                break;
            case INSERTELEMENT:
                sqlText = 'INSERT INTO elements (element_id, layout_id, typ, uri, pos_x, pos_y, size_x, size_y) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
                break;
            case UPDATELAYOUT:
                sqlText = 'UPDATE layouts SET erstelldatum = $2, user_id_ersteller = $3, name = $4 WHERE layout_id = $1';
                break;
            case UPDATEELEMENT:
                sqlText = 'UPDATE elements SET element_id = $1, typ = $3, uri = $4, pos_x = $5, pos_y = $6, size_x = $7, size_y = $8 WHERE layout_id = $2';
                break;
            case DELETELAYOUT:
                sqlText = 'DELETE FROM layouts WHERE layout_id = $1';
                break;
            case DELETEELEMENT:
                sqlText = 'DELETE FROM elements WHERE layout_id = $1';
                break;   
        }

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