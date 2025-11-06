<template>
  <div class="user-layout">
    <header class="main-header">
      <div class="logo">My Project</div>
      <nav>
        <router-link to="/home" class="nav-link">Home</router-link>
        <router-link to="/profile" class="nav-link">Profile</router-link>
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

export default {
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
  min-height: 100vh;
  background-color: #f4f7f9; /* Light background */
}

.main-header {
  background-color: #007bff; /* Primary color */
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
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
  background: none;
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  flex-grow: 1; /* Ensures content takes up remaining vertical space */
  padding: 30px;
}
</style>