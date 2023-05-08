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

export function fetchUserScore(params) {
  return axios({
    url: `/userScore/${params.round}/${params.gauge}/${params.witch}/${params.user}`,
    method: 'GET',
    data: params,
  });
}

export function fetchGaugeRewards(params) {
  return axios({
    url: `/gaugeRewards/${params.witch}/${params.platform}/${params.round}`,
    method: 'GET',
    data: params,
  });
}
