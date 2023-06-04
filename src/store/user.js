/* eslint-disable no-param-reassign */
import moment from 'moment';
import {
  dogeTokenContract, USDTContract, martinDepositContract, provider,
} from '@/eth/ethereum';
import { getTree } from '@/api/common';

const isMetamask = !!window.ethereum;

const user = {
  // namespaced: true,
  state: {
    isMetamask,
    loaded: !isMetamask,
    address: '',
    chainId: '',
    ethBalance: 0,
    usdtBalance: 0,

    crvFavPoolMap: {

    },

    cvxFavPoolMap: {

    },

    // depositAmount: 0,
    // period: 0,
    // reinvestAmount: 0,
    // withdrawAmount: 0,
    // events: [],
    // withdrawable: 0,
    // jsonAmount: 0,
    // proofTarget: [],
    // amount365: 0,

    // usdDecimals: 8,
    // dogeDecimals: 18,

    // min: 0,
    // max: 0,

    // positionOpened: false,

    // invitees: [],
  },

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

    SET_CRV_FAV: (state, payload) => {
      state.crvFavPoolMap = {
        ...state.crvFavPoolMap,
        [payload.pool]: payload.flag,
      };
    },
    SET_CVX_FAV: (state, payload) => {
      state.cvxFavPoolMap = {
        ...state.cvxFavPoolMap,
        [payload.pool]: payload.flag,
      };
    },
  },

  actions: {
    async handleAccountsChanged({ commit, dispatch, state }, accounts) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (accounts.length === 0) {
        commit('UPDATE_STATE', {
          address: '',
          chainId,
          loaded: true,
        });
      } else if (accounts[0] !== state.address) {
        commit('UPDATE_STATE', {
          address: accounts[0].address,
          chainId,
          loaded: true,
        });
        dispatch('getBalances');
      }
    },

    unlockByMetaMask({ dispatch }) {
      __wallet__.connect();
      // if (typeof window.ethereum === 'undefined') {
      //   throw Error('MetaMask is not installed!');
      // }

      // window.ethereum
      //   .request({ method: 'eth_requestAccounts' })
      //   .then((accounts) => {
      //     dispatch('handleAccountsChanged', accounts);
      //   })
      //   .catch((err) => {
      //     if (err.code === 4001) {
      //       // EIP-1193 userRejectedRequest error
      //       // If this happens, the user rejected the connection request.
      //       console.log('Please connect to MetaMask.');
      //     } else {
      //       console.error(err);
      //     }
      //   });
    },

    async getBalances({ commit, state }) {
      const [ethBalance, usdtBalance] = await Promise.all([
        provider.getBalance(state.address),
        USDTContract.balanceOf(state.address),
      ]);

      commit('UPDATE_STATE', {
        ethBalance,
        usdtBalance,
      });
    },


    // // 登出
    async LogOut({ commit }) {
      // await logout();
      window.__wallet__.disconnect();
      commit('RESET_STATE');
      window.location.reload();
    },

    // LoginByUsername({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     login({
    //       username: payload.username,
    //       password: payload.password,
    //       // csrfmiddlewaretoken: Cookies.get('csrftoken'),
    //     })
    //       .then((response) => {
    //         commit('SET_IS_LOGIN', true);
    //         commit('SET_ACCOUNT', payload.username);
    //         commit('SET_NAME', payload.username);
    //         resolve(response);
    //         return null;
    //       })
    //       .catch((error) => {
    //         reject(error);
    //         return null;
    //       });
    //   });
    // },
  },
};

export default user;
