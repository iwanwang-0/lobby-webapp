import axios from '@/common/axios';
import config from '@/config';

/**
 * 登录
 */
export function fetchBribeList(params) {
  return axios({
    url: `/bribelist/${params.witch}/${params.platform}/${params.round}`,
    method: 'GET',
    data: params,
  });
}

export function fetchUserScoreList(params) {
  return axios({
    url: `/userScore/${params.witch}/${params.platform}/${params.round}`,
    method: 'GET',
    data: params,
  });
}
