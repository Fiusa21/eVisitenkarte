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
import apiService from "@/services/api-service.js";




export default {
  name: 'ConnectivityIndicator',
  
  setup() {
    // Configuration
    const POLL_INTERVAL = 5000; // 5 seconds
    const isConnected = ref(false);
    const statusMessage = ref('Initializing...')

    let pollingInterval = null;

    const checkStatus = async () => {
      try {
        const result = await apiService.checkConnectivity();

        isConnected.value = result.isConnected;
        statusMessage.value = result.message;

      } catch (e) {
        isConnected.value = false;
        statusMessage.value = 'Error checking status';
      }
    };

    const startPolling = ()  => {
      checkStatus();
      pollingInterval = setInterval(checkStatus, POLL_INTERVAL);

    }
    
    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    onMounted(() => {
      startPolling();
    });
    
    onBeforeUnmount(() => {
      stopPolling();
    });
    return {
      isConnected,
      statusMessage
    }

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
  background-color: red; /* Amber */
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

/* Styles applied when isConnected is TRUE */
.status-circle.is-connected {
  background-color: #28a745; /* Green */
  box-shadow: 0 0 5px #28a745;
}
</style>