<template>
    <button @click="logout" class="logout-button">Logout</button>
</template>

<script>
import keycloakServices from '@/services/keycloak-service';

export default {
    name: 'LogoutButton',
    setup() {
        
        const logout = () => {
            //calls keycloak logout method
            keycloakServices.logout();
        };
        return {
        logout,
        };
    }
}
</script>