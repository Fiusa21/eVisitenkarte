import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js';

createApp(App).mount('#app')

const keycloakConfig = {
    url: 'http://localhost:5173/',
    realm: 'eVisitenkarte-development',
    clientId: 'eVisitenkarte-app',
};

const keycloak = new Keycloak(keycloakConfig);

keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256'
}).then((authenticated) => {
    if (authenticated) {
        console.log('User authenticated');
        // Make Keycloak instance available globally or inject into components
        app.config.globalProperties.$keycloak = keycloak;
        app.mount('#app');
    } else {
        console.warn('User not authenticated, redirecting to login...');

    }
}).catch((error) => {
    console.error('Keycloak initialization failed:', error);

});
