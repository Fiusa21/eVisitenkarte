
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const keycloakConfig = require('../config/keycloak-config');
//IMPORTANT FROM DOCUMENTATION:
/*MemoryStore, is purposely not designed for a production environment.
It will leak memory under most conditions, does not scale past a single process,
and is meant for debugging and developing.*/

//ALSO BE AWARE: VALID REDIRECT URL IS CURRENTLY '*' WHICH SHOULD LATER BE SPECIFIED
//SINCE IT IS A SECURITY FLAW
//using wildcard is easier for develop and testing purposes
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

module.exports = {
    sessionMiddleware: session({
        secret: 'some secret', // Use a strong secret in production
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    }),
    keycloakMiddleware: keycloak.middleware(),
    protect: keycloak.protect(),
    // You can also expose the keycloak instance if you need it elsewhere
    // keycloakInstance: keycloak
};