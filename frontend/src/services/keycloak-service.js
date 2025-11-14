import Keycloak from 'keycloak-js';

const KEYCLOAK_CONFIG = {
    url: 'http://localhost:5173/',
    realm: 'eVisitenkarte-development', //keycloak-realm
    clientId: 'eVisitenkarte-app', //keycloak frontend-client
};

let keycloakInstance = null;

const KeycloakService = {
    init: async () => {
        if (keycloakInstance) {
            return keycloakInstance;
        }

        keycloakInstance = new Keycloak(KEYCLOAK_CONFIG);

        try {
            const authenticated = await keycloakInstance.init({
                onLoad: 'login-required',
                pkceMethod: 'S256',
            });
            console.log('Keycloak initialized. Authenticated:', authenticated);
            console.log(keycloakInstance.token);
            console.log(keycloakInstance.tokenParsed);

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

    //maybe more functions required
};

export default KeycloakService;