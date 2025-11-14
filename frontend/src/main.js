// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// Create the Vue application instance
const app = createApp(App);

// Mount the application to the DOM element with id="app"
app.mount('#app');

console.log("Vue application mounted successfully!");