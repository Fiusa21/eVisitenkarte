// src/services/keycloak-service.js
import Keycloak from 'keycloak-js';

const KEYCLOAK_CONFIG = {
    url: 'http://localhost:5173/',
    realm: 'eVisitenkarte-development',
    clientId: 'eVisitenkarte-app', // e.g., 'vue-app'
};

let keycloakInstance = null;

const KeycloakService = {
    init: async () => {
        if (keycloakInstance) {
            return keycloakInstance; // Already initialized
        }

        keycloakInstance = new Keycloak(KEYCLOAK_CONFIG);

        try {
            const authenticated = await keycloakInstance.init({
                onLoad: 'login-required', // or 'check-sso'
                pkceMethod: 'S256', // Recommended for public clients
            });
            console.log('Keycloak initialized. Authenticated:', authenticated);
            console.log(keycloakInstance.token);
            console.log(keycloakInstance.token);
            return keycloakInstance;
        } catch (error) {
            console.error('Keycloak initialization failed', error);
            throw error;
        }
    },

    isLoggedIn: () => {
        return keycloakInstance && keycloakInstance.authenticated;
    },

    getToken: () => {
        return keycloakInstance ? keycloakInstance.token : null;
    },

    logout: () => {
        if (keycloakInstance) {
            keycloakInstance.logout();
        }
    },

    // You can add more Keycloak-related methods here if needed
    // e.g., refreshToken, updateToken, etc.
};

export default KeycloakService;