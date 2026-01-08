<template>
  <div class="admin-layout">
    <header class="main-header">
      <div class="header-left">
        <div class="admin-slider">
          <div class="slider-text">Admin Modus</div>
          <AdminToggle class="admin-toggle" toggle-id="admin-mode-toggle" v-model="isAdminMode" /> 
        </div>
      </div>

      <div class="header-center">
        <TopBar />
      </div>

      <div class="header-right">
        <LogoutButton />
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
    <ConnectivityIndicator class="fixed-indicator" />

  </div>
</template>

<script> 
import { ref } from 'vue';
import AdminToggle from '@/components/AdminSlider.vue';
import TopBar from '@/components/TopBar.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import ConnectivityIndicator from '@/components/ConnectivityIndicator.vue';

export default {

  name: 'AdminLayout',
  components: { AdminToggle, TopBar, LogoutButton, ConnectivityIndicator },
  setup() {
    const isAdminMode = ref(false); // Initial state is OFF

    return {
        isAdminMode
    };
  }
}
</script>

<style scoped>
/* Basic Flexbox and Grid for Layout */
.admin-layout {
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
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* left / center (TopBar) / right */
  align-items: center;
  gap: 12px;
  max-width: 100%;
}

.header-left {
  justify-self: start;
  display: flex;
  align-items: center;
}

.header-right {
  justify-self: end;
  display: flex;
  align-items: center;
}

.header-center {
  width: 100%;
  justify-self: center;
  display: flex;
  align-items: center;
  pointer-events: auto; /* ensure the centered TopBar is interactive */
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

.slider-text {
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
    /* 1. Use fixed positioning relative to the viewport */
    position: fixed; 
    
    /* 2. Anchor it to the bottom and right edges */
    bottom: 20px; /* Adjust spacing from the bottom */
    right: 20px;  /* Adjust spacing from the right */
    
    /* 3. Ensure it sits above all other content */
    z-index: 1000; 
    
    /* Optional: Style adjustments for better visibility */
    background-color: rgba(0, 0, 0, 0.7); /* Dark background */
    color: white; 
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.9em;
}
@media screen and (max-width: 750px) {
  .main-header {
      max-width: 100%;
  }
  
  /* Tablets (600px and up) */
@media screen and (max-width: 732px) {
  .site-header h1 {
    font-size: 4em;
  }
  
  .site-header p {
    font-size: 1.3em;
  }

  .site-header {
    padding: 0px;

  }
  .layouts {
    justify-content: center;
    gap: 20px;
  }

}

/* Desktop (1024px and up) */
@media screen and (min-width: 1024px) {
  .site-header h1 {
    font-size: 5em;
  }

  .site-header p {
    font-size: 1.5em;
  }
}
}
</style>