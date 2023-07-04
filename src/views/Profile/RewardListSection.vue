<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Claimed Records
      </span>
      <div class="header-right">

        <CuSelect
          type="simple"
          class="cu-select"
          :options="marketOption"
          v-model="market"
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
      </TableList>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';
import TableList from '@/components/TableList';
import RoundSelect from '@/components/RoundSelect';
import toFixed from '@/filters/toFixed';
import trimAddress from '@/filters/trimAddress';
import hexToUtf8 from '@/filters/hexToUtf8';
import utf8ToHex from '@/filters/utf8ToHex';

import { getCvxVotes } from '@/api/snapshot';
import { getRewardHistory } from '@/api/thegraph';
import { WEEK_SECONDS, CRV_START_SECONDS, CVX_START_SECONDS } from '@/constants/time';
import CuSelect from '@/components/CuSelect';

export default {
  components: {
    TableList,
    RoundSelect,
    CuSelect,
  },

  props: {
  },

  data() {
    return {
      list: [],

      market: 'All',

      submitting: false,
      loading: false,

    };
  },

  computed: {
    ...mapState(['user', 'marketOption', 'tokenMap']),
    cols() {
      return [
        {
          title: 'Platform',
          prop: 'platform',
          color: '#ccc',
        },
        {
          title: 'Token',
          prop: 'token',
        },
        {
          title: 'Amount',
          prop: 'amount',
        },
        {
          title: 'TxHash',
          prop: 'txHash',
          render(text, record) {
            return `<a href="https://etherscan.io/tx/${record.transactionHash}">${text}</a>`
          },
        },
        {
          title: 'Time',
          prop: 'time',
          render(text) {
            return moment(text * 1000).format('yyyy-MM-DD HH:mm');
          },
        },
      ];
    },
  },

  watch: {
    market: {
      handler() {
        this.getRewardList();
      },
      immediate: true,
    },
    'user.address': {
      handler() {
        this.getRewardList();
      },
      immediate: true,
    },
  },

  created() {
    this.getVotes();
  },

  methods: {


    onVoteTypeChange(value) {
      this.voteType = value;
    },

    async getVotes() {
      this.getRewardList();
    },

    async getRewardList() {
      if (!this.user.address) {
        return;
      }
      this.loading = true;
      this.list = [];

      const data = await getRewardHistory({
        address: this.user.address,
        market: this.market === 'All' ? '' : utf8ToHex(this.market),
      });
      this.loading = false;
      const list = [];
      if (data?.claimedRecords) {
        data.claimedRecords.forEach((item) => {
          const token = this.tokenMap[item.rewardToken.toLowerCase()];
          const symbol = token?.symbol ?? '-';
          const decimal = token?.decimal ?? 18;
          list.push({
            amount: toFixed(item.amount / 10 ** decimal, 4),
            time: item.blockTimestamp,
            platform: hexToUtf8(item.platform),
            token: symbol,
            txHash: trimAddress(item.transactionHash),
            transactionHash: item.transactionHash,
          });
        });
      }

      this.list = list;
    },

    async getCvxVotes() {
      this.loading = true;

      const res = await getCvxVotes({
        voter: this.user.address,
        start: this.round * WEEK_SECONDS,
        end: this.round * WEEK_SECONDS + WEEK_SECONDS * 2,
      });
      this.loading = false;

      const list = [];

      if (res?.data?.votes) {
        res.data.votes.forEach((item) => {
          const { choice, proposal } = item;

          const choiceItemKey = Object.keys(choice);

          const sumPower = choiceItemKey.reduce((sum, keyItem) => sum + choice[keyItem], 0);

          const cvxStartRound = Math.floor(CVX_START_SECONDS / WEEK_SECONDS) - 1;

          choiceItemKey.forEach((keyItem) => {
            list.push({
              round: Math.ceil((this.round - cvxStartRound) / 2),
              pool: proposal.choices[keyItem - 1],
              quantity: item.vp * choice[keyItem] / sumPower,
              time: item.created,
            });
          });
        });
      }
      this.list = list;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.type-select {
  margin-right: 24px;
}
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
