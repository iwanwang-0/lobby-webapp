import axios from '@/common/axios';
import config from '@/config';

/**
 * 登录
 */
export function login(params) {
  return axios({
    url: '/account/login',
    method: 'POST',
    data: params,
  });
}
/**
 * 获取登录用户信息
 * @param {*}
 */
export function getUser() {
  // return {
  //   success: true,
  //   data: {
  //     account: 'allen',
  //     id: '123',
  //     // resources: [],
  //   },
  // };
  return axios({
    url: '/account/userinfo',
    method: 'GET',
  });
}

/**
 * 获取登录用户信息
 * @param {*}
 */
export function logout() {
  return axios({
    url: '/account/logout',
    method: 'GET',
  });
}

/**
 * 获取持仓
 * @param {*}
 */
export async function getCrvRewardTree() {
  const data = await fetch(
    'https://api.github.com/repos/iwanwang-0/lobby-merkledata/contents/vecrv/amount.json',
    {
      headers: {
        Authorization: `token ${config.githubToken}`,
      },
    },
  )
    .then((d) => d.json())
    .then((d) => fetch(
      `https://api.github.com/repos/iwanwang-0/lobby-merkledata/git/blobs/${d.sha}`,
      {
        headers: {
          Authorization: `token ${config.githubToken}`,
        },
      },
    ))
    .then((d) => d.json())
    .then((d) => JSON.parse(atob(d.content)));

  return data;
}

/**
 * 获取持仓
 * @param {*}
 */
export async function getCvxRewardTree() {
  const data = await fetch(
    'https://api.github.com/repos/iwanwang-0/lobby-merkledata/contents/vlcvx/amount.json',
    {
      headers: {
        Authorization: `token ${config.githubToken}`,
      },
    },
  )
    .then((d) => d.json())
    .then((d) => fetch(
      `https://api.github.com/repos/iwanwang-0/lobby-merkledata/git/blobs/${d.sha}`,
      {
        headers: {
          Authorization: `token ${config.githubToken}`,
        },
      },
    ))
    .then((d) => d.json())
    .then((d) => JSON.parse(atob(d.content)));

  return data;
}

/**
 * @param {*}
 */
export function getTokenMap() {
  return axios({
    baseURL: '/',
    url: '/tokenMap.json',
    method: 'GET',
  });
}

/**
 * @param {*}
 */
export function getGaugeNameMap() {
  return axios({
    baseURL: '/',
    url: '/gaugeNameMap.json',
    method: 'GET',
  });
}
