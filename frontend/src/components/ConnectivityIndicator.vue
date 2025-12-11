<template>
  <div class="connectivity-indicator">
    <p>Device Status:</p>
    
    <div 
      :class="['status-circle', { 'is-connected': isConnected }]" 
      :title="statusMessage"
    ></div>
    
    <span>{{ statusMessage }}</span>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Configuration
const API_ENDPOINT = '/api/device/status'; 
const POLL_INTERVAL = 5000; // 5 seconds

export default {
  name: 'ConnectivityIndicator',
  
  setup() {
    // 1. Reactive State
    const isConnected = ref(false);
    const statusMessage = ref('Checking...');
    let pollingInterval = null; // Use a standard let variable for the interval ID

    // 2. Methods
    const checkConnectivity = async () => {
      try {
        statusMessage.value = 'Checking...';
        
        const response = await fetch(API_ENDPOINT);
        const data = await response.json(); 

        if (response.ok) {
          // *** Success: API returned 200 OK ***
          isConnected.value = true; 
          statusMessage.value = data.message || 'Connected (Online)';
          
        } else if (response.status === 503) {
          // *** Expected Error: API returned 503 ***
          isConnected.value = false; 
          statusMessage.value = data.message || 'Disconnected (503)';
          
        } else {
          // Handle other HTTP errors
          isConnected.value = false;
          statusMessage.value = `Server Error (${response.status})`;
        }
      } catch (error) {
        // Handle network errors
        console.error('Connectivity check failed:', error);
        isConnected.value = false;
        statusMessage.value = 'Network Error (Unreachable)';
      }
    };
    
    const startPolling = () => {
      checkConnectivity(); 
      // Store the interval ID in the outside variable
      pollingInterval = setInterval(checkConnectivity, POLL_INTERVAL);
    };
    
    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    // 3. Lifecycle Hooks (Composition API equivalent of mounted/beforeUnmount)
    onMounted(() => {
      startPolling();
    });
    
    onBeforeUnmount(() => {
      stopPolling();
    });

    // 4. Return reactive state and methods for use in the template
    return {
      isConnected,
      statusMessage,
    };
  }
}
</script>

<style scoped>
.connectivity-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: sans-serif;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.status-circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  /* Default state (Disconnected / Checking) */
  background-color: #ffc107; /* Amber */
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

/* Styles applied when isConnected is TRUE */
.status-circle.is-connected {
  background-color: #28a745; /* Green */
  box-shadow: 0 0 5px #28a745;
}
</style>