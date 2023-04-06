import axios from '@/common/axios';
import config from '@/config';

// export function getAllGauges() {
//   return axios({
//     baseURL: config.curveUrl,
//     url: '/api/getAllGauges',
//     method: 'GET',
//   });
// }

export function getAllGauges() {
  return axios({
    baseURL: '/',
    url: '/getAllGauges.json',
    method: 'GET',
  });
}
