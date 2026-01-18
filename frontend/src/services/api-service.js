import KeycloakService from './keycloak-service';
import {ref} from "vue";

//for testing with echo api, there is a public/unprotected endpoint /public
const API_BASE_URL = 'http://localhost:3000/api'; //base api url, for testing see echo api

//TODO: check for unused api calls
const ApiService = {
    //check if user is logged in and get token
    checkAuthorization: async () => {
        if (!KeycloakService.isLoggedIn()) {
            throw new Error('User not logged in.');
        }

        const token = KeycloakService.getToken();
        if (!token) {
            throw new Error('No token available.');
        }
        return token;
    },

    //generic response checker
    checkResponse: async (response) => {
        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`API call failed: ${response.status} - ${errorData.message || response.statusText}`);
        }
    },

    checkConnectivity : async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/device/status`,);
            let data = {};

            if (response.ok) {
                return {
                    isConnected: true,
                    statusMessage: data.message || 'Connected (Online)'
                }

            } else if (response.status === 503) {
                // *** Expected Error: API returned 503 ***
                console.log('NO DEVICE CONNECTED! Api working')
                return {
                    isConnected: false,
                    statusMessage: data.message || 'Disconnected (503)',
                }
            } else {
                // Handle other HTTP errors
                return {
                    isConnected: false,
                    statusMessage: `Server Error (${response.status})`
                }
            }

        } catch (error) {
            // Handle network errors
            console.error('Connectivity check failed:', error);
            return {
                isConnected: false,
                statusMessage: 'Network Error (Unreachable)'
            }
        }
    },

    //test function for protected endpoint, sending jwt vie Bearer
    callProtectedEndpoint: async () => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/protected`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error('Error calling protected API:', error);
            throw error;
        }
    },

    //fetch all layouts
    getAllLayouts: async () => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/layout-management/layouts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }); 
            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error('Error fetching layouts:', error);
            throw error;
        }
    },

    //fetch layout by id
    getLayoutById: async (id) => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/layout-management/layouts/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }); 
            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error(`Error fetching layout with id ${id}:`, error);
            throw error;
        }
    },

    //insert new layout
    insertLayout: async (layout) => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/layout-management/layouts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(layout),
            }); 
            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error('Error inserting layout:', error);
            throw error;
        }
    },

    //update layout
    updateLayout: async (layout) => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/layout-management/layouts/${layout.layout_id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(layout),
            }); 
            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error('Error updating layout:', error);
            throw error;
        }
    },

    //delete layout
    deleteLayout: async (id) => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/layout-management/layouts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }); 
            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error('Error deleting layout:', error);
            throw error;
        }
    },


    /**
     * Sends raw binary image data to the display endpoint
     * @param {ArrayBuffer} imageBuffer - Raw binary data from html-to-image
     */
    uploadImage: async (imageBuffer) => {
        const token = await ApiService.checkAuthorization();
        try {
            const response = await fetch(`${API_BASE_URL}/display/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/octet-stream',
                },
                body: imageBuffer, // Pass the ArrayBuffer directly as the body
            });

            return await ApiService.checkResponse(response);
        } catch (error) {
            console.error('Error uploading image to display:', error);
            throw error;
        }
    },

};

export default ApiService;