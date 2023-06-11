<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Vote List
      </span>
      <div class="header-right">

        <CuButton
          class="link-btn"
          variant="link"
          :loading="submitting"
          @click="onVoteAll"
          :disabled="!voteDisabled"
        >
          Vote All
        </CuButton>
<!--
        <RoundSelect
          :options="roundOptions"
          @change="selectChange"
          v-model="round"
        /> -->

        <!-- <CuSelect
          type="simple"
          class="cu-select"
          :options="marketOption"
          v-model="market"
        /> -->
      </div>
    </div>

    <div class="content">
      <VoteList
        :voteType="voteType"
        :cvxFavPoolMap="user.cvxFavPoolMap"
        :valueMap="valueMap"
        :cols="cols"
        :list="voteList"
        :loading="loading"
        :submitting="submitting"
      >
        <template v-slot:operation="{ row }">
          <CuButton
            variant="link"
            :disabled="submitting"
            @click.stop="() => {
              onVote(row)
            }"
          >
            Vote
          </CuButton>
        </template>
      </VoteList>
    </div>
    <!-- <div class="footer">
      <CuPagination
        :page="1"
        :pageSize="10"
        :total="999"
      ></CuPagination>
    </div> -->
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { BigNumber, utils } from 'ethers';
import { cloneDeep } from 'lodash';

import CuButton from '@/components/CuButton';
// import RoundSelect from '@/components/RoundSelect';
import CuPagination from '@/components/CuPagination';
import CuSelect from '@/components/CuSelect';

import { vote } from '@/api/snapshot';
import sendTransaction from '@/common/sendTransaction';
import config from '@/config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

import {
  GaugeControllerContract,
  GaugeControllerInterface,
  getERC20Contract, MultiMerkleStashContract,
  MultiMerkleStashInterface, provider,
  VotiumVeCRVContract, VotiumVeCRVInterface,
} from '@/eth/ethereum';
import toFixed from '@/filters/toFixed';
import { fetchBribeList, fetchUserScore } from '@/api/dashbord';
import VoteList from './VoteList';

export default {
  components: {
    VoteList,
    CuButton,
    // CuSelect,
    // RoundSelect,
    CuPagination,
  },

  props: {
    voteType: {
      type: String,
    },
  },

  data() {
    const { platform, round } = this.$route.params;

    return {
      WEEK_SECONDS: 7 * 24 * 60 * 60,

      // WEEK_SECONDS: 7 * 24 * 60 * 60,

      // valueMap: {},

      // market: platform,

      round,

      valueMap: {},
      labelChoiceMap: {},

      cols: [
        {
          title: 'Sort',
          prop: 'sort',
          width: '80px',
        },
        {
          title: 'Pool',
          prop: 'pool',
          width: '160px',
        },
        // {
        //   title: 'Apr',
        //   prop: 'Apr',
        // },
        {
          title: 'Weight',
          prop: 'weight',
        },
        {
          title: 'New Weight',
          prop: 'newWeight',
          isEdit: true,
          width: 350,
          // opBtn: 'Best Option',
          opClick: () => {
            console.log(this);
          },
        },
        ...[
          this.voteType === 'VeCRV' ? {
            title: 'Operation',
            prop: 'operation',
          } : null,
        ],
      ].filter((item) => item),

      market: 'All',

      submitting: false,
      loading: false,

      rewardMapLoaded: false,
      guageRewardMap: {},

    };
  },

  computed: {
    ...mapState(['user', 'tokenMap', 'guageNameMap']),
    ...mapGetters(['roundOptions']),
    ...mapState(['cvxChoices', 'proposal', 'marketOption']),
    voteList() {
      if (!this.rewardMapLoaded) {
        return [];
      }
      const list = this.cvxChoices.map((item, idx) => ({
        choice: idx + 1,
        pool: item.label.replace(/\(.*\)/, ''),
        weight: 0,
        newWeight: 0,
        percent: 0,
        rewards: this.guageRewardMap[idx]?.rewards || 0,
      }));

      const topList = list.filter((item) => this.user.cvxFavPoolMap[item.pool])
        .sort((a, b) => b.rewards - a.rewards);
      const otherList = list.filter((item) => !this.user.cvxFavPoolMap[item.pool])
        .sort((a, b) => b.rewards - a.rewards);

      return [
        ...topList,
        ...otherList,
      ];
    },

    voteDisabled() {
      return Object.keys(this.valueMap).reduce((sum, key, idx) => {
        const value = Number.parseInt(this.valueMap[key], 10) || 0;
        return sum + value;
      }, 0);
    },
  },

  watch: {
    cvxChoices: {
      handler() {
        this.cvxChoices.forEach((item, idx) => {
          this.labelChoiceMap[item.label.replace(/\(.*\)/, '')] = idx + 1;
        });
      },
      immediate: true,
    },
  },

  created() {
    this.getList();
    // this.getReward();
  },

  methods: {
    selectChange() {
      this.getReward();
    },

    async getList() {
      this.loading = true;
      const roundTime = this.round * this.WEEK_SECONDS;

      const res = await fetchBribeList({
        witch: this.voteType === 'VeCRV' ? 'crv' : 'cvx',
        platform: this.market.toLowerCase(),
        round: this.voteType === 'VlCVX' && config.debug ? this.hourStart : roundTime,
      });
      this.loading = false;
      this.rewardMapLoaded = true;
      if (res.success) {
        this.total = res.data.length;
        const guageRewardMap = {};
        this.list = res.data.forEach((item, idx) => {
          const amountU = item.bribes.reduce((sum, bribe) => sum + BigNumber.from(bribe.tokenAmount.hex || 0) / (10 ** bribe.tokenDecimals) * bribe.tokenPrice, 0);
          guageRewardMap[item.choice] = {
            rewards: toFixed(amountU, 4),
            name: item.name,
          };
        });

        // console.log(guageRewardMap)

        this.guageRewardMap = guageRewardMap;
      } else {
        this.guageRewardMap = {};
      }
    },

    async onVoteAll() {
      this.submitting = true;

      const choiceMap = Object.keys(this.valueMap).reduce((choices, key, idx) => {
        const value = Number.parseInt(this.valueMap[key], 10) || 0;
        if (value) {
          // eslint-disable-next-line no-param-reassign
          choices[this.labelChoiceMap[key]] = value;
        }
        return choices;
      }, {});
      try {
        await vote({
          account: this.user.address,
          proposal: this.proposal.id,
          choice: choiceMap,
        });
        this.showSuccess('Succeeded');
      } catch (error) {
        this.showError(error.reason || error.message);
      }
      this.submitting = false;
    },

    async onVote(record) {
      // const { tokenId } = this.$route.query;
      // const { amount } = this;
      // if (amount < this.min) {
      //   this.showError(`The minimum claim is ${this.min} DOGE`);
      //   return;
      // }

      // console.log(amount, tAddr, round);
      this.submitting = true;
      try {
        const result = await vote({
          account: this.user.account,
          proposal: this.proposal.id,
          choice: [],
        });

        this.showPending('Pending', {
          tx: result,
        });

        // const buyTx = await provider.waitForTransaction(txHash);

        // if (buyTx.status === 1) {
        //   this.showSuccess('Succeeded', {
        //     tx: txHash,
        //   });
        //   this.getReward();
        //   // this.$store.dispatch('getPosition');
        //   // this.$store.dispatch('getWithdrawable');
        //   // this.$store.dispatch('getBalances');
        // } else {
        //   this.showError('Failed', {
        //     tx: txHash,
        //   });
        // }
      } catch (error) {
        this.showError(error.data.message);
        console.error(error.data.message);
      }
      this.submitting = false;
    },

    openForward() {
      this.$refs['my-modal'].show();
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
        height: 50px;
        font-size: 24px;
      }
    }

  }

  .footer {
    border-top: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
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

  }
}

</style>
