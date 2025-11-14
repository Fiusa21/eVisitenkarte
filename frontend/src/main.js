import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import './assets/main.css';

// Create the Vue application instance
const app = createApp(App);
app.use(router);
//mount the application to the DOM element with id="app"
app.mount('#app');

console.log("Vue application mounted successfully!");