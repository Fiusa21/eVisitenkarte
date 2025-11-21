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

<style scoped>
.logout-button {
  font-size: 1.5em;
  font-family: 'Dosis', sans-serif;
  background: none;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
  border-radius: 8px;
}

.logout-button:hover{
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-button:active {
  transform: translateY(2px);
}
</style>