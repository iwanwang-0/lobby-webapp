import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout';

// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    // name: 'Home',
    component: Layout,
    // redirect: '/home',
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard'),
      },
      {
        path: '/bribe',
        name: 'bribe',
        component: () => import('@/views/Bribe'),
      },

      {
        path: '/vote',
        name: 'vote',
        component: () => import('@/views/Vote'),
      },
      // {
      //   path: '/faq',
      //   name: 'faq',
      //   component: () => import('@/views/Faq'),
      // },

      // {
      //   path: '/cavas/detail',
      //   name: 'CanvasDetail',
      //   component: () => import('@/views/CanvasDetail'),
      // },

      // {
      //   path: '/mine',
      //   name: 'Mine',
      //   component: () => import('@/views/Mine'),
      // },
      // {
      //   path: '/mine/work/detail',
      //   name: 'MineWorkDetail',
      //   component: () => import('@/views/MineWorkDetail'),
      // },

      // {
      //   path: '/swap/detail',
      //   name: 'MineWorkDetail',
      //   component: () => import('@/views/SwapDetail'),
      // },

      // {
      //   path: '/collection/create',
      //   name: 'CollectionCreate',
      //   component: () => import('@/views/CollectionCreate'),
      // },
    ],
  },
  // ...login,
];

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior() {
    const scrolls = document.getElementsByClassName('layout-content-scroll');
    if (scrolls.length > 0) scrolls[0].scrollTop = 0;
  },
});

// router.beforeEach((to, from, next) => {
//   // eslint-disable-next-line
//   if (to.meta.excludeLogin || __g_store__.state.user.isLogin) {
//     next();
//   } else {
//     next({
//       path: '/client/login',
//       replace: true,
//     });
//   }
// });

export default router;
