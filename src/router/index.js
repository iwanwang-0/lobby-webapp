import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index'),
  },
  {
    path: '/',
    // name: 'Home',
    component: Layout,
    // redirect: '/home',
    children: [
      {
        path: '/home',
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

      {
        path: '/lob',
        name: 'lob',
        component: () => import('@/views/Lob'),
      },
      {
        path: '/reward',
        name: 'reward',
        component: () => import('@/views/Reward'),
      },
      {
        path: '/vote/VeCRV/:platform/:round',
        name: 'vote-edit',
        component: () => import('@/views/VoteEditCrv'),
      },
      {
        path: '/vote/VlCVX/:platform/:round',
        name: 'vote-edit',
        component: () => import('@/views/VoteEditCvx'),
      },
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
