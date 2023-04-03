import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import config from '@/config';
import user from './user';
import enums from './enums';
import getters from './getters';
import { getChoices } from '@/api/snapshot'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      key: `vuex_${config.storeVersion}`,
      paths: ['user.isLogin'],
    }),
  ],
  modules: {
    user,
    enums,
  },
  state: {
    cvxChoices: [],
  },
  getters,
  mutations: {
    UPDATE_STATE: (state, payload) => {
      Object.assign(state, payload);
    },
    RESET_STATE: (state) => {
      Object.assign(state, {
        address: '',
        chainId: '',
      });
    },
  },
  actions: {
    async getChoices({ commit, state }) {
      const choices = await getChoices();
      commit('UPDATE_STATE', {
        cvxChoices: choices,
      });
    },
  },
});
