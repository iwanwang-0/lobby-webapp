<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Bribe history
      </span>
    </div>

    <div class="content">
      <TableList
        :cols="cols"
        :list="list"
      />
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import TableList from '@/components/TableList';
import {
  getERC20Contract, getERC20Interface, provider,
  VotiumVeCRVContract, VotiumVeCRVInterface,
  VotiumBribeCVXContract, VotiumBribeCVXInterface,
} from '@/eth/ethereum';

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
        },
      ],
      list: [
        {
          round: '1',
          pool: 'ETH-alETH',
          token: 'ETH',
          quantity: '100',
          time: '2022/02/22',
        },
        {
          round: '2',
          pool: 'ETH-alETH',
          token: 'ETH',
          quantity: '100',
          time: '2022/02/22',
        },
      ]
    }
  },
  computed: {
    ...mapState(['user']),

  },
  created() {
    this.getCrvHistory();
  },
  methods: {
    async  getCrvHistory() {
      const res = await VotiumVeCRVContract.getBribeInfo(this.user.address);
      console.log(res);
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
          return {
            amount: item.amount,
            round: item.round,
            gauge: item.gauge,
            token: item.token,
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
      if (Array.isArray(res)) {
        this.list = res.map((item) => {
          // console.log(item)
          return {
            amount: item.amount,
            round: item.round,
            gauge: item.gauge,
            token: item.token,
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
