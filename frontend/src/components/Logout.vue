<template>
    <button @click="logout" class="logout-button">Logout</button>
</template>

<script>
export default {
    name: 'logout',
    setup() {

        //Adjust to keycloak-services
        const logout = () => {
            keycloakServices.logout();
            isAuthenticated = false;
            backendResponse = null;
            error = null;
        };
        return {
        logout,
        };
    }
}
</script>