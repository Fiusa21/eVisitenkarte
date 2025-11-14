module.exports = {
    realm: 'eVisitenkarte-development', // e.g., 'myrealm'
    'auth-server-url': 'http://localhost:8080/', // e.g., 'http://localhost:8080/auth'
    resource: 'eVisitenkarte-backend', // e.g., 'node-backend'
    'bearer-only': true,
    'ssl-required': 'external',
    'use-resource-role-mappings': true,
    'confidential-port': 0,
};