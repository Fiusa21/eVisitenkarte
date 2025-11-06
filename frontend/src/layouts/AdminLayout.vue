<template>
  <div class="admin-layout">
    
    <aside class="admin-sidebar">
      <div class="logo-area">Admin Panel</div>
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          Dashboard
        </router-link>
        <router-link to="/admin/users" class="nav-item">
          Nutzer (Users)
        </router-link>
        </nav>
      
      <button @click="handleLogout" class="sidebar-logout">
        Logout
      </button>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <p>Current View: **{{ currentRouteName }}**</p>
      </header>
      
      <section class="admin-content-view">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // Reactive property to display the current route name in the header
    const currentRouteName = computed(() => {
        return route.name ? route.name.toUpperCase() : 'NO NAME';
    });

    const handleLogout = () => {
      // Placeholder: Your colleague's Keycloak logout function will replace this.
      console.log('Admin Logout initiated.');
      router.push('/'); // Redirect to the main page/login
    };

    return {
      currentRouteName,
      handleLogout,
    };
  }
}
</script>

<style scoped>
/* Basic Two-Column Layout using Grid */
.admin-layout {
  display: grid;
  /* Sidebar width (e.g., 250px) and the rest for main content */
  grid-template-columns: 250px 1fr; 
  min-height: 100vh;
  background-color: #f4f7f9; 
}

/* Sidebar Styles */
.admin-sidebar {
  background-color: #34495e; 
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.logo-area {
  padding: 0 20px 30px;
  font-size: 1.6rem;
  font-weight: bold;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Pushes the logout button to the bottom */
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  transition: background-color 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: #4e6a81; /* Lighter color on hover/active */
  border-left: 4px solid #42b983; /* Accent color */
}

.sidebar-logout {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 10px 20px;
  margin: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Main Content Styles */
.admin-main {
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: white;
  color: black;
  padding: 15px 30px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.admin-content-view {
  padding: 30px;
  flex-grow: 1;
}
</style>