<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Bribe history
      </span>
    </div>

    <div class="content">
      <TableList
        :loading="loading"
        :cols="cols"
        :list="list"
      />
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import TableList from '@/components/TableList';
import {
  getERC20Contract, getERC20Interface, provider,
  VotiumVeCRVContract, VotiumVeCRVInterface,
  VotiumBribeCVXContract, VotiumBribeCVXInterface,
} from '@/eth/ethereum';
import toFixed from '@/filters/toFixed';

export default {
  components: {
    TableList,
  },

  data() {
    return {
      cols: [
        {
          title: 'Round',
          prop: 'round',
        },
        {
          title: 'Pool',
          prop: 'pool',
        },
        {
          title: 'Token',
          prop: 'token',
        },
        {
          title: 'Quantity',
          prop: 'quantity',
        },
        {
          title: 'Time',
          prop: 'time',
          render(text) {
            return moment(text * 1000).format('yyyy-MM-DD HH:mm')
          }
        },
      ],
      list: [
        // {
        //   round: '1',
        //   pool: 'ETH-alETH',
        //   token: 'ETH',
        //   quantity: '100',
        //   time: '2022/02/22',
        // },
        // {
        //   round: '2',
        //   pool: 'ETH-alETH',
        //   token: 'ETH',
        //   quantity: '100',
        //   time: '2022/02/22',
        // },
      ],
      loading: false,
    }
  },
  computed: {
    ...mapState(['user', 'tokenMap', 'guageNameMap']),
  },
  created() {
    this.getCrvHistory();
  },
  methods: {
    async  getCrvHistory() {
      this.loading = true;
      const res = await VotiumVeCRVContract.getBribeInfo(this.user.address);
      this.loading = false;

//     struct BribeInfo {
//     address token;
//     uint256 amount;
//     uint256 round;
//     address gauge;
//     uint256 time;
// }
      if (Array.isArray(res)) {
        this.list = res.map((item) => {
          // console.log(item)
          // console.log(item)
          // console.log(this.guageNameMap)
          // console.log(this.guageNameMap[item.gauge])
          const token = this.tokenMap[item.token.toLowerCase()];
          const guage = this.guageNameMap[item.gauge.toLowerCase()];
          return {
            quantity: toFixed(item.amount / 10 ** token.decimals, 4),
            round: item.round,
            gauge: item.gauge,
            pool: guage?.shortName,
            token: token?.symbol,
            time: item.time,
          }
        })
      }
    },

    async  getCvxHistory() {
      const res = await VotiumBribeCVXContract.getBribeInfo(this.user.address);
      console.log(res);
//       struct BribeInfo {
//     address token;
//     uint256 amount;
//     bytes32 proposal;
//     uint256 choiceIndex;
//     uint256 time;
// }
// quantity: toFixed(item.amount / 10 ** token.decimals, 4),
//             round: item.round,
//             gauge: item.gauge,
//             pool: guage?.shortName,
//             token: token?.symbol,
//             time: item.time,
      if (Array.isArray(res)) {
        this.list = res.map((item) => {
          const token = this.tokenMap[item.token.toLowerCase()];
          // const guage = this.guageNameMap[item.gauge.toLowerCase()];
          return {
            quantity: toFixed(item.amount / 10 ** token.decimals, 4),
            round: 'round',
            pool: 'shortName',
            token: token?.symbol,
            time: item.time,
          }
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.top-section {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-rows: 130px auto;
  .header {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .content {
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}
</style>
