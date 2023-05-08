import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import config from '@/config';
import { getProposal } from '@/api/snapshot';
import { getAllGauges } from '@/api/curve';
import { getTokenMap, getGaugeNameMap } from '@/api/common';

import user from './user';
import enums from './enums';
import getters from './getters';

Vue.use(Vuex);

const WEEK_SECONDS = 7 * 24 * 60 * 60;

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      key: `vuex_${config.storeVersion}`,
      paths: ['user.isLogin', 'user.crvFavPoolMap', 'user.cvxFavPoolMap'],
    }),
  ],
  modules: {
    user,
    enums,
  },
  state: {

    totalRound: Math.floor(Date.now() / 1000 / WEEK_SECONDS),
    proposal: {},
    allGauges: {},
    cvxChoices: [],
    crvChoices: [],

    tokenMap: {},
    guageNameMap: {},

    marketOption: [
      // {
      //   label: 'All',
      //   value: 'All',
      // },
      {
        label: 'Lobby',
        value: 'Lobby',
      },
      {
        label: 'Votium',
        value: 'Votium',
      },
      {
        label: 'yBribe',
        value: 'yBribe',
      }, {
        label: 'VoteMarket',
        value: 'VoteMarket',
      },
    ],
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

    async getTokenMap({ commit, state }) {
      const data = await getTokenMap();
      commit('UPDATE_STATE', {
        tokenMap: {
          ...data.goerli,
          ...data.mainnet,
        },
      });
    },

    async getGaugeNameMap({ commit, state }) {
      const data = await getGaugeNameMap();
      commit('UPDATE_STATE', {
        guageNameMap: data,
      });
    },

    async getProposal({ commit, state }) {
      const proposal = await getProposal();
      commit('UPDATE_STATE', {
        proposal,
        cvxChoices: proposal.choices?.map((item, idx) => ({
          value: idx,
          label: item,
        })) || [],
      });
    },

    async getGauges({ commit, state }) {
      const { success, data } = await getAllGauges();
      if (success) {
        commit('UPDATE_STATE', {
          allGauges: data,
          crvChoices: Object.keys(data).map((key) => ({
            value: key,
            label: key,
          })),
        });
      }
    },
  },
});
