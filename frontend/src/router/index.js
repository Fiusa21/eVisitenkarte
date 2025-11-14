// Example Route Setup
import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AdminDashboard from '@/views/AdminDashboard.vue'; 
import Nutzerverwaltung from '@/views/Nutzerverwaltung.vue';
import UserLayout from '@/layouts/UserLayout.vue'; 
import UserHome from '@/views/UserHome.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Initial/Keycloak Redirect Path (might need adjustment later)
    { path: '/', redirect: '/home' }, 

    // 2. Authenticated User Area Route
    {
      path: '/home',
      // This route uses the UserLayout as the container
      component: UserLayout,
      children: [
        {
          // This path will be /home
          path: '',
          name: 'user-home',
          component: UserHome
        },
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      // The AdminLayout acts as the parent container
      component: AdminLayout,
      children: [
        {
          // This path will be /admin/dashboard
          path: 'dashboard',
          name: 'dashboard',
          component: AdminDashboard
        },
        {
          // This path will be /admin/users (for the Nutzer list)
          path: 'users',
          name: 'userlist',
          component: Nutzerverwaltung
        },
        // Route for viewing a single user's details (e.g., /admin/users/123)
        {
          path: 'users/:id',
          name: 'userdetails',
          // You will create this component later
          component: () => import('@/views/AdminUserDetails.vue')
        }
      ]
    },

    // ... add Admin routes later, which will use an AdminLayout ...
  ]
});

export default router;