import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store/index.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/dashboard',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/Landing.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/Products.vue'),
  },
  {
    path: '/share',
    name: 'Share',
    component: () => import('@/views/Share.vue'),
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/Categories.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/Logout.vue'),
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
  },
  {
    path: '/confirm',
    name: 'ConfirmAccount',
    component: () => import('@/views/ConfirmAccount.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
  },
  {
    path: '/sharing-links/:token',
    name: 'Sharing',
    component: () => import('@/views/Sharing.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = store.getters;

  if (isLoggedIn && to.name !== 'Logout') {
    var expiry = localStorage.getItem('expiryToken');
    var today = new Date().getTime();

    if (today >= expiry) next({ name: 'Logout' });
  }

  if (to.name !== 'Login' && !isLoggedIn) {
    if (to.name === 'Register') next();
    else if (to.name === 'ResetPassword') next();
    else if (to.name === 'ConfirmAccount') next();
    else if (to.name === 'Landing') next();
    else if (to.name === 'Sharing') next();
    else next({ name: 'Login' });
  } else if (to.name === 'Login' && isLoggedIn) next({ name: 'Home' });
  else if (to.name === 'Register' && isLoggedIn) next({ name: 'Home' });
  else if (to.name === 'ResetPassword' && isLoggedIn) next({ name: 'Home' });
  else if (to.name === 'ConfirmAccount' && isLoggedIn) next({ name: 'Home' });
  else if (to.name === 'Landing' && isLoggedIn) next({ name: 'Home' });
  else next();
});

export default router;
