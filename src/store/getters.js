/**
 * 全局getter
 */
const getters = {
  name: (state) => state.user.name,

  roundOptions: (state) => {
    return new Array(state.totalRound).fill(0).map((item, idx) => {
      return {
        label: state.totalRound - idx - 1,
        value: state.totalRound - idx - 1,
      }
    })
  }

};
export default getters;
