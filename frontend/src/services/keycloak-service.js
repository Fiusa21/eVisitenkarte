import Keycloak from 'keycloak-js';

const KEYCLOAK_CONFIG = {
    url: 'http://localhost:5173/',
    realm: 'eVisitenkarte-development', //keycloak-realm
    clientId: 'eVisitenkarte-app', //keycloak frontend-client
};

let keycloakInstance = null;

const KeycloakService = {
    init: async (forceLogin = false) => { //Parameter added
        if (keycloakInstance) {
            return keycloakInstance;
        }

        keycloakInstance = new Keycloak(KEYCLOAK_CONFIG);

        try {

            //If forcedLogin is true, we use login-required
            //otherwse we check if user is already logged in with check-sso
            const onLoadStrategy = forceLogin ? 'login-required' : 'check-sso';

            const authenticated = await keycloakInstance.init({
                onLoad: onLoadStrategy, // New Parameter
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

    //new Method for maual Login
    login: async (options = {}) =>{
        if(keycloakInstance){
            await keycloakInstance.login(options);
        }else {
            await KeycloakService.init(true); //Keycloak initialization and login
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