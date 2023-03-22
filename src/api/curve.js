import axios from '@/common/axios';
import config from '@/config';
/**
 * 获取登录用户信息
 * @param {*}
 */
export function getAllGauges() {
  return axios({
    baseURL: config.curveUrl,
    url: '/api/getAllGauges',
    method: 'GET',
  });
}
