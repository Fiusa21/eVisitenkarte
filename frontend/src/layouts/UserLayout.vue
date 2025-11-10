<template>
  <div class="user-layout">
    <header class="main-header">
      <div class="admin-slider">
        <div class="text">Admin Modus</div>
        <AdminToggle class="admin-toggle" toggle-id="admin-mode-toggle" v-model="isAdminMode" /> 
      </div>
      <nav>
        <button @click="logout" class="logout-button">Logout</button>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
// Composition API for Vue 3
import { useRouter } from 'vue-router'; 
import { ref } from 'vue';
import AdminToggle from '@/components/AdminSlider.vue';



export default {

  name: 'UserLayout',
  components: { AdminToggle },
  setup() {
    const isAdminMode = ref(false); // Initial state is OFF

    // WATCHER LOGIC (Important for your requirement)
    // You would add logic here to watch isAdminMode and route to the AdminDashboard
    // or AdminLayout when it changes to true.
    
    return {
      isAdminMode,
    };
  },
  // Name the component
  name: 'UserLayout',
  setup() {
    const router = useRouter(); 
    
    // Placeholder for Keycloak Logout
    const logout = () => {
      // **TODO: Implement Keycloak logout logic here**
      console.log("User initiated logout. Redirecting to Keycloak logout URL.");
      // For now, redirect to the login path:
      router.push('/'); 
    };

    return {
      logout,
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
  background-color: transparent; /* Primary color */
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
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover, .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-button {
  font-size: 1.5em;
  font-family: 'Dosis', sans-serif;
  background: none;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
}

.logout-button:hover{
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-button:active {
  transform: translateY(2px);
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
</style>