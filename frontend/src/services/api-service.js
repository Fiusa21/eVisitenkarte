import KeycloakService from './keycloak-service';

//for testing with echo api, there is a public/unprotected endpoint /public
const API_BASE_URL = 'http://localhost:3000/api'; //base api url, for testing see echo api


const ApiService = {

    //test function for protected endpoint, sending jwt vie Bearer
    callProtectedEndpoint: async () => {
        if (!KeycloakService.isLoggedIn()) {
            throw new Error('User not logged in.');
        }

        const token = KeycloakService.getToken();
        if (!token) {
            throw new Error('No token available.');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/protected`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`API call failed: ${response.status} - ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error calling protected API:', error);
            throw error;
        }
    },


};

export default ApiService;