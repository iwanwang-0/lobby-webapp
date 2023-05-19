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
import { getProposalListById } from '@/api/snapshot';

export default {
  components: {
    TableList,
  },

  props: {
    voteType: {
      type: String,
    },
  },

  data() {
    return {
      WEEK_SECONDS: 7 * 24 * 60 * 60,
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
            return moment(text * 1000).format('yyyy-MM-DD HH:mm');
          },
        },
      ],
      list: [],
      loading: false,
    };
  },
  computed: {
    ...mapState(['user', 'tokenMap', 'guageNameMap']),
  },
  created() {
    this.getList();
  },
  watch: {
    voteType() {
      this.list = [];
      this.getList();
    },
  },
  methods: {
    getList() {
      console.log(this.voteType);
      if (this.voteType === 'VeCRV') {
        this.getCrvHistory();
      } else {
        this.getCvxHistory();
      }
    },
    async  getCrvHistory() {
      this.loading = true;
      const res = await VotiumVeCRVContract.getBribeInfo(this.user.address);
      this.loading = false;

      if (Array.isArray(res)) {
        this.list = res.map((item) => {
          const token = this.tokenMap[item.token.toLowerCase()];
          const guage = this.guageNameMap[item.gauge.toLowerCase()];
          return {
            quantity: toFixed(item.amount / 10 ** token.decimals, 4),
            round: item.round,
            gauge: item.gauge,
            pool: guage?.shortName,
            token: token?.symbol,
            time: item.time,
          };
        });
      }
    },

    async  getCvxHistory() {
      this.loading = true;
      const res = await VotiumBribeCVXContract.getBribeInfo(this.user.address);
      //       struct BribeInfo {
      //     address token;
      //     uint256 amount;
      //     bytes32 proposal;
      //     uint256 choiceIndex;
      //     uint256 time;
      // }
      // 获取所有proposal，然后再获取对应的pool和round
      // console.log(res);

      const proposals = await getProposalListById(res.map(((item) => item.proposal)));

      this.loading = false;

      const proposalsMap ={};
      proposals.forEach((proposal) => {
        proposalsMap[proposal.id] = proposal.choices;
      })

      if (Array.isArray(res)) {
        const list = res.map((item) => {
          const token = this.tokenMap[item.token.toLowerCase()];
          const round = Math.floor(item.time / this.WEEK_SECONDS);
          const index = parseInt(item.choiceIndex, 10);
          const pool = proposalsMap?.[item.proposal]?.[index];
          return {
            quantity: toFixed(item.amount / 10 ** token.decimals, 4),
            round,
            pool: pool || '-',
            proposal: item.proposal,
            choiceIndex: parseInt(item.choiceIndex, 10),
            token: token?.symbol,
            time: item.time,
          };
        });

        // console.log(res);
        // console.log('xxx')
        // console.log(xxx);
        // let proposalChoiceMap = {}


        // Object.keys(proposals).forEach((key) => {
        //   const proposal = proposals[key];
        //   // const index = list.findIndex((item) => item.time === proposal.start);
        //   // if (index > -1) {
        //   //   list[index].pool = proposal.name;
        //   // }
        // });
        this.list = list;
      }
    },
  },
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
