<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Vote history
      </span>
      <div class="header-right">
        <RoundSelect
          :options="roundOptions"
          @change="selectChange"
          v-model="round"
        />
      </div>
    </div>

    <div class="content">
      <TableList
        :cols="cols"
        :list="list"
        :loading="loading"
        :is-expand="false"
      >
        <!-- <template v-slot:operation="{ row }">
          <CuButton
            variant="link"
            :disabled="submitting"
            @click.stop="() => {
              this.$router.push('/vote-edit')
            }"
          >
            Vote
          </CuButton>
        </template> -->
      </TableList>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';
import { BigNumber, utils } from 'ethers';
import TableList from '@/components/TableList';
import RoundSelect from '@/components/RoundSelect';
// import CuButton from '@/components/CuButton';
import toFixed from '@/filters/toFixed';

import { getCrvRewardTree } from '@/api/common';
import sendTransaction from '@/common/sendTransaction';
import config from '@/config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

import { getCvxVotes, getVotePower } from '@/api/snapshot';
import { getCrvHistory } from '@/api/thegraph';

export default {
  components: {
    TableList,
    RoundSelect,
    // CuButton,
  },

  props: {
    voteType: {
      type: String,
    },
  },

  data() {
    return {

      round: 0,

      forwardAddress: '',
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
          title: this.voteType === 'VeCRV' ? 'Quantity VeCRV' : 'Quantity VlCVX',
          prop: 'quantity',
        },
        {
          title: 'Time',
          prop: 'time',
          render(text) {
            return moment(text * 1000).format('yyyy-MM-DD HH:mm');
          },
        },
      ],
      list: [],

      market: 'All',

      submitting: false,
      loading: false,

      rewardTree: null,
    };
  },

  computed: {
    ...mapState(['user', 'marketOption']),
    ...mapGetters(['roundOptions']),
    ...mapState(['cvxChoices', 'proposal']),
  },

  watch: {
    roundOptions: {
      handler() {
        this.round = this.roundOptions[0].value;
      },
      immediate: true,
    },

    round() {
      this.list = [];
      this.getVotes();
    },
  },

  created() {
    this.getVotes();
  },

  methods: {
    selectChange() {
      // this.getReward();
    },

    async getVotes() {
      if (this.voteType === 'VeCRV') {
        this.getCrvHistory();
      } else {
        this.getCvxVotes();
      }
    },

    async getCrvHistory() {
      console.log('getCrvHistory')
      this.loading = true;
      const data = await getCrvHistory({
        round: this.round,
        user: this.user.address,
      });
      this.loading = false;

      const list = [];
      if (data) {
        data.forEach((item) => {
          list.push({
            round: this.round,
            pool: item.gauge,
            quantity: toFixed(item.veCRV / 10 ** 18, 2),
            weight: item.weight,
            time: item.time,
          });
        });
      }

      console.log(list)
      this.list = list;
    },

    async getCvxVotes() {
      this.loading = true;

      const res = await getCvxVotes({
        voter: this.user.address,
      });
      this.loading = false;

      // const resPower = await getVotePower({
      //   // proposal: this.proposal.id,
      //   voter: this.user.address,
      // });

      // let vp = 0;
      // if (resPower?.data?.vp?.vp) {
      //   vp = resPower?.data?.vp?.vp;
      // }

      const list = [];

      if (res?.data?.votes) {
        res.data.votes.forEach((item) => {
          const { choice, proposal } = item;

          const choiceItemKey = Object.keys(choice);

          const sumPower = choiceItemKey.reduce((sum, keyItem) => sum + choice[keyItem], 0);

          choiceItemKey.forEach((keyItem) => {
            list.push({
              round: 108,
              pool: proposal.choices[keyItem - 1],
              quantity: item.vp * choice[keyItem] / sumPower,
              time: moment(item.created * 1000).format('YYYY-MM-DD HH:mm:ss'),
            });
          });
        });
      }
      this.list = list;
    },

    openForward() {
      this.$refs['my-modal'].show();
    },

    // async getReward() {
    //   this.loading = true;
    //   this.list = [];
    //   const tempList = [];
    //   const tree = await getCrvRewardTree();
    //   this.rewardTree = Object.freeze(tree);
    //   if (tree) {
    //     Object.keys(tree).forEach((tAddr) => {
    //       const tokenDetail = tree[tAddr];
    //       tokenDetail.values.forEach((item) => {
    //         const { treeIndex, value: [round, uAddr, amount] } = item;
    //         if (parseInt(round, 10) === this.round && uAddr.toLowerCase() === this.user.address) {
    //           tempList.push({
    //             treeIndex,
    //             round,
    //             uAddr,
    //             tAddr,
    //             amount,
    //           });
    //         }
    //       });
    //     });
    //     // console.log(tree);
    //     // console.log(this.list);
    //     const infoList = await Promise.all(tempList.map((item) => this.getTokenInfo(item.tAddr)));

    //     for (let i = 0; i < tempList.length; i++) {
    //       tempList[i].symbol = infoList[i].symbol;
    //       tempList[i].decimals = infoList[i].decimals;
    //       tempList[i].rewards = tempList[i].amount / 10 ** infoList[i].decimals;
    //     }

    //     this.list = tempList;
    //   }

    //   this.loading = false;
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.top-section {
  border-top: 1px solid $border-color;
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-rows: 130px auto;
  .header {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    padding-right: 10px;
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-right {
      display: flex;
      align-items: center;

      .link-btn {
        margin-right: 30px;
        width: 130px;
        height: 50px;
      }
    }

  }
  .content {
    font-family: "ChillPixels Maximal";
    & .row1 {
      font-size: 18px;
      display: flex;
      align-items: center;
      padding-left: 9px;
      height: 28px;
      color: #ccc;
      & > div {
        margin-right: 40px;
      }
      em {
        color: #1DD186;
        font-style: normal;
      }
      & .claim-btn {
        font-size: 18px;
      }
    }
    & .row2 {
      font-size: 14px;
      display: grid;
      grid-template-columns: 230px 230px 230px 230px;
      row-gap: 20px;
      background: rgba(27, 25, 31, 0.45);
      border: 1px dashed #787878;
      padding: 8px;
      margin: 18px 0;
      width: 912px;
      & .label {
        color: #666666;
      }

      & .content {
        color: #CCCCCC;
      }
    }
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}

</style>
