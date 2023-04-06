import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import config from '@/config';
import user from './user';
import enums from './enums';
import getters from './getters';
import { getProposal } from '@/api/snapshot'

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
    cvxProposal: {}
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
    async getProposal({ commit, state }) {
      const proposal = await getProposal();
      commit('UPDATE_STATE', {
        proposal,
        cvxChoices: proposal.choices,
      });
    },
  },
});
