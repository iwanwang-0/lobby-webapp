/**
 * 全局getter
 */
const getters = {
  name: (state) => state.user.name,

  roundOptions: (state) => {
    return new Array(state.totalRound).fill(0).map((item, idx) => {
      return {
        label: state.totalRound - idx,
        value: state.totalRound - idx,
      }
    })
  }

};
export default getters;
