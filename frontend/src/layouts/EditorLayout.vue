<template>
  <div class="editor-layout">
    <header class="main-header">
      <div class="header-left">
        <div class="admin-slider" v-if="isAdmin">
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
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import AdminToggle from '@/components/AdminSlider.vue';
import TopBar from '@/components/TopBar.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import KeycloakService from '@/services/keycloak-service';

export default {

  name: 'AdminLayout',
  components: { AdminToggle, TopBar, LogoutButton },
  setup() {
    const isAdminMode = ref(true); // ON because we're in admin/editor mode
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
.editor-layout {
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
    overflow: hidden;
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
</style>