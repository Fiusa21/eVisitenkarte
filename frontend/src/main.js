import './assets/main.css';
import router from '@/router';

import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js';

createApp(App).mount('#app')
const app = createApp(App);
app.use(router);
app.mount('#app');

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

        //TODO: use in class, set authentication header
        console.log(keycloak.token);
        console.log(keycloak.tokenParsed);
        keycloak.loadUserInfo().then(r => {
            console.log(keycloak.userInfo);
        });

        //app.mount('#app');
    } else {
        console.warn('User not authenticated, redirecting to login...');

    }
}).catch((error) => {
    console.error('Keycloak initialization failed:', error);

});
