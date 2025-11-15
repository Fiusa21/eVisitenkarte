<template>
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>
    <div class="login-container">
        <h1>Anmeldung erforderlich</h1>
        <p>Bitte klicken Sie auf "Anmelden", um sich über Keycloak anzumelden und zur Anwendung zu gelangen.</p>
        <button @click="handleLogin">Anmelden</button>
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

<style scoped>
.login-container h1{
    font-size: 3em;
    font-family: 'Dosis', sans-serif;
    font-weight: 500;
    margin: 0;
    padding: 0;
    line-height: 1;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.site-header h1{
    font-size: 5em;
    font-family: 'Dosis', sans-serif;
    font-weight: 500;
    margin: 0;
    padding: 0;
    line-height: 1;  
}

.site-header p{
    font-size: 1.5em;
    font-family: 'Dosis', sans-serif;
    font-weight: 300;
    margin: 0;
    padding: 0;
    margin-top: -5px;
}

.login-container button{
    min-width: 120px;
    height: 36px;
    padding: 6px 14px;
    border-radius: 18px;
    background: transparent;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
    font-family: 'Dosis', sans-serif;
    background: none;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
}

button:hover{
    background-color: #FB8500;
}
</style>