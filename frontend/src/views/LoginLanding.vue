<template>
  <div class="login-container">
    <h1>Anmeldung erforderlich</h1>
    <p>Bitte klicken Sie auf "Anmelden", um sich mit Keycloak zu authentifizieren und zur Anwendung zu gelangen.</p>
    <button @click="handleLogin">Zur Anmeldung</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import KeycloakService from '@/services/keycloak-service'; 

const router = useRouter();

const handleLogin = async () => {
    // Starts the keycloak login process
    // 'redirectUri' makes sure we return to user-home after login
    const redirectUri = window.location.origin + router.resolve({ name: 'user-home' }).href;
    
    //call new login method 
    await KeycloakService.login({ redirectUri: redirectUri });
};

// checks if user is already logged in 
onMounted(async () => {
    // makes suere keycloak is initialized  with check-sso
    try {
        await KeycloakService.init(); 
        if (KeycloakService.isLoggedIn()) {
            // If already logged in, redirect to user-home
            router.replace({ name: 'user-home' });
        }
    } catch (error) {
        console.error('Initial check failed', error);
    }
});
</script>