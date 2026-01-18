import Keycloak from 'keycloak-js';
import { ref } from 'vue';

const KEYCLOAK_CONFIG = {
    url: 'http://localhost:8080/',
    realm: 'eVisitenkarte-development', //keycloak-realm
    clientId: 'eVisitenkarte-app', //keycloak frontend-client
};

let keycloakInstance = null;
const userToken = ref(null);

const KeycloakService = {
    init: async (forceLogin = false) => { //Parameter added
        if (keycloakInstance) {
            return keycloakInstance;
        }

        keycloakInstance = new Keycloak(KEYCLOAK_CONFIG);

        try {

            //If forcedLogin is true, we use login-required
            //otherwse we check if user is already logged in with check-sso.
            //because we dont have sso, no active session will be found => keycloakInstance.authenticated = false
            const onLoadStrategy = forceLogin ? 'login-required' : 'check-sso'; 

            const authenticated = await keycloakInstance.init({
                onLoad: onLoadStrategy, // New Parameter
                pkceMethod: 'S256',
            });

            if(authenticated) {
               console.log('Keycloak initialized. Authenticated:', authenticated);
                console.log(keycloakInstance.token);
                console.log(keycloakInstance.tokenParsed);
                userToken.value = keycloakInstance.tokenParsed;
            } else{
                userToken.value = null;
            }
            
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
        userToken.value = null;
    },

    getIdTokenParsed: () => {
        return userToken;
    },

    getUserRoles: () => {
        const parsed = userToken.value;
        if (!parsed) return [];

        const realmRoles = parsed.realm_access?.roles || [];
        const clientRoles = Object.values(parsed.resource_access || {})
            .flatMap((client) => client?.roles || []);

        return [...new Set([...realmRoles, ...clientRoles])];
    },

    hasRole: (roleName) => {
        if (!roleName) return false;
        return KeycloakService.getUserRoles().includes(roleName);
    }
};

export default KeycloakService;