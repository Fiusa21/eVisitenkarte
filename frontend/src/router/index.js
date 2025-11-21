// Example Route Setup
import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue'; 
import UserHome from '@/views/UserHome.vue';
import AdminHome from '@/views/AdminHome.vue';
import LoginLanding from '@/views/LoginLanding.vue';

//impprt for Guard
import KeycloakService from '@/services/keycloak-service';
import LayoutEditor from '@/views/LayoutEditor.vue';
import EditorLayout from '@/layouts/EditorLayout.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Initial/Keycloak Redirect Path
    { path: '/', 
      name: 'landing',
      component: LoginLanding
     }, 

    // 2. Authenticated User Area Route
    {
      path: '/home',
      meta: { requiresAuth: true},
      component: UserLayout, 
      children: [
        {
          path: '', 
          name: 'user-home',
          component: UserHome
        },
      ]
    },
    {
      path: '/admin',
      meta: { requiresAuth: true, requiresRole: 'admin' },
      component: AdminLayout, 
      children: [
        {
          // This path will be /admin-home
          path: '',
          name: 'admin-home',
          component: AdminHome
        },
      ]
    },
    {
      path: '/editor',
      meta: { requiresAuth: true, requiresRole: 'admin' }, 
      component: EditorLayout,
      children: [
        {
          // This path will be /admin-home
          path: '',
          name: 'layout-editor',
          component: LayoutEditor
        },
      ]
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  try{
    await KeycloakService.init(); //Initializing Keycloak
  }catch(error){
    console.error('Keycloak initialization failed in Guard.', error);
    return next({ name: 'landing' });
  }

  if (to.meta.requiresAuth){
    //Route requires authentication
    if(KeycloakService.isLoggedIn()){
      //User is logged in
      next();
    }else{
      //User is not logged in, redirect to landing page
      console.log('Acces denied. Redirecting to Login.');
      next({ name: 'landing', query: { redirect: to.fullPath } });
    }
  }else {
    //Route needs no authentication
    if(to.name === 'landing' && KeycloakService.isLoggedIn()){
      next({ name: 'user-home' });
    }else{
      //Otherwise proceed as normal
      next();
    }
  }
})

export default router;