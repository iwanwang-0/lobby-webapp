import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

import { BootstrapVue } from 'bootstrap-vue';
import moment from 'moment';
import vClickOutside from 'v-click-outside'
import i18n from '@/i18n';
import { getLang } from '@/common/lang';

import App from './App.vue';
import router from './router';
import store from './store';
import '@/mixin';
import '@/filters';

import '@/styles/theme-overrides/index.scss';

import './initMetamask';


Vue.use(vClickOutside)
Vue.use(BootstrapVue);

// Vue.use(IconsPlugin);
Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;

// eslint-disable-next-line
window.__g_store__ = store;
// eslint-disable-next-line
window.__g_router__ = router;
// eslint-disable-next-line
window.__g_i18n__ = i18n;

store.dispatch('getDogePrice');
store.dispatch('getRange');

const lang = getLang();
if (['zh', 'en'].includes(lang)) {
  i18n.locale = lang;
}

if (lang === 'zh') {
  moment.locale('zh-cn');
}

// eslint-disable-next-line no-underscore-dangle
window.__g_root__ = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
