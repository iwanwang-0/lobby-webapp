import { WEEK_SECONDS, CRV_START_SECONDS, CVX_START_SECONDS } from '@/constants/time';


/**
 * 全局getter
 */
const getters = {
  name: (state) => state.user.name,

  crvRoundOptions: (state) => new Array(state.totalRound).fill(0)
    .map((item, idx) => {
      const crvStartRound = Math.floor(CRV_START_SECONDS / WEEK_SECONDS);
      return {
        label: state.totalRound - idx - crvStartRound,
        value: state.totalRound - idx,
      };
    })
    .filter((item) => item.label > 0),

  cvxRoundOptions: (state) => new Array(state.totalRound).fill(0)

    .map((item, idx) => {
      const cvxStartRound = Math.floor(CVX_START_SECONDS / WEEK_SECONDS);
      return {
        label: state.totalRound - idx - cvxStartRound,
        value: state.totalRound - idx,
      };
    })
    .filter((item) => item.label > 0)
    .filter((item) => item.label % 2 === 1)
    .map((item, idx, list) => ({
      label: list.length - idx,
      value: item.value,
    })),
};
export default getters;
