<template>
  <div id="app">
    <h1>Frontend (Modularized)</h1>
    <p v-if="!isAuthenticated">Please log in to access features.</p>
    <button v-if="!isAuthenticated" @click="login">Login with Keycloak</button>
    <button v-if="isAuthenticated" @click="callBackend">Call Protected Backend</button>
    <button v-if="isAuthenticated" @click="logout">Logout</button>
    <p v-if="backendResponse">Backend Response: {{ backendResponse }}</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import KeycloakService from './services/keycloak-service';
import ApiService from './services/api-service';

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false,
      backendResponse: null,
      error: null,
    };
  },
  async created() {
    try {
      await KeycloakService.init();
      this.isAuthenticated = KeycloakService.isLoggedIn();
    } catch (err) {
      this.error = 'Keycloak initialization failed. See console for details.';
      this.isAuthenticated = false;
    }
  },
  methods: {
    async login() {
      // KeycloakService.init() handles the login redirect.
      // If 'onLoad: check-sso' was used, you might have a dedicated login method here.
      // For 'login-required', the init call already handles the redirect.
      console.log("Login button clicked, Keycloak init should handle it if not logged in.");
      // For simplicity, we just re-run init. In a real app, you might only call init once or handle
      // the 'onLoad' logic more explicitly.
      try {
        await KeycloakService.init();
        this.isAuthenticated = KeycloakService.isLoggedIn();
      } catch (err) {
        this.error = 'Login failed. See console for details.';
      }
    },
    async callBackend() {
      this.error = null;
      this.backendResponse = null;
      try {
        const data = await ApiService.callProtectedEndpoint();
        this.backendResponse = data.message;
      } catch (err) {
        this.error = err.message || 'Failed to call backend API.';
      }
    },
    logout() {
      KeycloakService.logout();
      this.isAuthenticated = false;
      this.backendResponse = null;
      this.error = null;
    }
  },
};
</script>

<style>
/* ... (same styles as before) ... */
</style>