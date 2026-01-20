<template>
  <div class="user-layout">
    <header class="main-header">
      <div class="admin-slider" v-if="isAdmin">
        <div class="text">Admin Modus</div>
        <AdminToggle class="admin-toggle" toggle-id="admin-mode-toggle" v-model="isAdminMode" /> 
      </div>
        <LogoutButton />
    </header>

    <main class="main-content">
      <router-view />
    </main>
    <ConnectivityIndicator class="fixed-indicator" />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import AdminToggle from '@/components/AdminSlider.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import ConnectivityIndicator from '@/components/ConnectivityIndicator.vue';
import KeycloakService from '@/services/keycloak-service';

export default {
  name: 'UserLayout',
  components: { AdminToggle, LogoutButton, ConnectivityIndicator },
  setup() {
    const isAdminMode = ref(false); // Initial state is OFF
    const isAdmin = computed(() => KeycloakService.hasRole('admin'));

    return {
      isAdminMode,
      isAdmin
    };
  }
}
</script>

<style scoped>
/* Basic Flexbox and Grid for Layout */
.user-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #f4f7f900;
}

.main-header {
  background-color: transparent; 
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.nav-link:hover, .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    box-sizing: border-box;
    background-color: transparent;
}

/* Admin slider + label aligned vertically in the center */
.admin-slider {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.text {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  line-height: 1; /* tighter baseline so it centers nicely next to the switch */
}

.admin-toggle {
  display: inline-flex;
  align-items: center;
}

.fixed-indicator {
    position: fixed; 
    bottom: 20px; 
    right: 20px;
    z-index: 1000; 
    background-color: rgba(0, 0, 0, 0.7);
    color: white; 
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.9em;
}
</style>