import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store/index.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/Products.vue'),
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
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = store.getters;
  
  if(isLoggedIn && to.name !== 'Logout'){
    var expiry = localStorage.getItem('expiryToken');
    var today = (new Date()).getTime();
    
    if(today >= expiry) next({ name: 'Logout' });
  }

  if (to.name !== 'Login' && !isLoggedIn) {
    if (to.name === 'Register') next();
    else next({ name: 'Login' });
  } else if (to.name === 'Login' && isLoggedIn) next({ name: 'Home' });
  else if (to.name === 'Register' && isLoggedIn) next({ name: 'Home' });
  else next();
});

export default router;
