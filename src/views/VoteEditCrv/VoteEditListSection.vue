<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Vote List
      </span>
      <div class="header-right">

        <!-- <CuButton
          class="link-btn"
          variant="link"
          :loading="submitting"
          @click="onVoteAll"

        >
          Vote All
        </CuButton> -->
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
        <div class="tip">
          Total voting power :
          <em>{{ crvBalance }} veCRV</em>
          （used <em>{{crvBalance ? userPower / crvBalance * 100 : 0  | toFixed(2)}}%</em> ,
          unallocated <em>{{(crvBalance ? (crvBalance - userPower) / crvBalance * 100 : 0) | toFixed(2)}}%</em>）
        </div>
      </div>
    </div>

    <div class="content">
      <VoteList
        :voteType="voteType"
        :valueMap="valueMap"
        :crvFavPoolMap="user.crvFavPoolMap"
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
import { fetchBribeList, fetchUserScore } from '@/api/dashbord';
import toFixed from '@/filters/toFixed';
import { getCrvHistory } from '@/api/thegraph';

// import {
//   getERC20Contract, getERC20Interface, provider,
//   getProdERC20Contract,
// } from '@/eth/ethereum';

import {
  GaugeControllerContract,
  GaugeControllerInterface,
  getProdERC20Contract,
  provider,
} from '@/eth/ethereum';
import VoteList from './VoteList';

export default {
  components: {
    VoteList,
    CuButton,
    // CuSelect,
    // RoundSelect,
    // CuPagination,
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

      valueMap: {},

      market: platform,

      round,

      submitting: false,
      loading: false,

      historyMap: {},

      guageRewardsMap: {},

      crvBalance: 0,
      userPower: 0,
    };
  },

  computed: {
    ...mapState(['user', 'tokenMap', 'guageNameMap']),
    ...mapGetters(['roundOptions']),
    ...mapState(['crvList', 'proposal', 'allGauges', 'marketOption']),
    voteList() {
      const list = this.crvList.map((item, idx) => ({
        choice: idx + 1,
        pool: item.name,
        address: item.address,
        weight: this.historyMap[item.address.toLowerCase()]?.weight || 0,
        newWeight: 0,
        rewards: this.guageRewardsMap[item.address.toLowerCase()] || 0,
      }));

      const topList = list.filter((item) => this.user.crvFavPoolMap[item.pool])
        .sort((a, b) => b.rewards - a.rewards);
      const otherList = list.filter((item) => !this.user.crvFavPoolMap[item.pool])
        .sort((a, b) => b.rewards - a.rewards);

      return [
        ...topList,
        ...otherList,
      ];
    },
  },

  watch: {
    // crvList: {
    //   handler() {
    //     this.crvList.forEach((item, idx) => {
    //       this.labelChoiceMap[item.label] = idx + 1;
    //     });
    //   },
    //   immediate: true,
    // },
    // 'user.address': function () {
    //   this.getMyVote();
    // },

    user: {
      handler() {
        if (this.user.address) {
          this.getCrvBalance();
          this.getMyVote();
          this.getCrvHistory();
        }
      },
      immediate: true,
    },
  },

  async created() {
    this.getList();
    // this.getMyVote();
  },

  methods: {
    selectChange() {
      this.getReward();
    },

    async getCrvBalance() {
      const balance = await getProdERC20Contract(config.VeCRV).balanceOf(this.user.address);
      this.crvBalance = toFixed(balance / 1e18, 2);
    },

    async getMyVote() {
      if (this.user.address) {
        const userPower = await GaugeControllerContract.vote_user_power(this.user.address);
        this.userPower = toFixed(userPower / 1e18, 2);
      }
    },
    async getCrvHistory() {
      const data = await getCrvHistory({
        round: this.round,
        user: this.user.address,
      });
      this.historyMap = data.reduce((map, item) => {
        // eslint-disable-next-line no-param-reassign
        map[item.gauge] = item;
        return map;
      }, {});

      // console.log(this.historyMap)
    },

    async onVoteAll() {
      this.submitting = true;
      // const choiceMap = this.innerList.reduce((choices, item, idx) => {
      //   const value = Number.parseInt(item.newWeight, 10) || 0;
      //   if (value) {
      //     choices[idx + 1] = value;
      //   }
      //   return choices;
      // }, {});

      try {
        await vote({
          account: this.user.address,
          proposal: this.proposal.id,
          choice: this.valueMap,
        });

        this.showSuccess('Succeeded');
      } catch (error) {
        this.showError(error.error_description || error.message);
      }
      this.submitting = false;
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
      if (res.success) {
        this.total = res.data.length;
        const guageRewardsMap = {};
        this.list = res.data.forEach((item, idx) => {
          const amountU = item.bribes.reduce((sum, bribe) => sum + BigNumber.from(bribe.tokenAmount.hex || 0) / (10 ** bribe.tokenDecimals) * bribe.tokenPrice, 0);
          guageRewardsMap[item.gaugeAddr] = toFixed(amountU, 4);
        });

        this.guageRewardsMap = guageRewardsMap;
      } else {
        this.guageRewardsMap = {};
      }
    },

    async onVote(record) {
      const newWeight = Number.parseFloat(this.valueMap[record.pool]);

      if (!newWeight) {
        this.showError('Please input vote weight');
        return;
      }
      // const { tokenId } = this.$route.query;
      // const { amount } = this;
      // if (amount < this.min) {
      //   this.showError(`The minimum claim is ${this.min} DOGE`);
      //   return;
      // }

      this.submitting = true;
      try {
        const txHash = await sendTransaction({
          to: config.GaugeController,
          gas: 640000,
          data: GaugeControllerInterface.encodeFunctionData('vote_for_gauge_weights', [
            record.address,
            newWeight * 100,
          ]),
        });

        this.showPending('Pending', {
          tx: txHash,
        });

        const buyTx = await provider.waitForTransaction(txHash);

        if (buyTx.status === 1) {
          this.showSuccess('Succeeded', {
            tx: txHash,
          });
        } else {
          this.showError('Failed', {
            tx: txHash,
          });
        }
      } catch (error) {
        this.showError(error.message);
        console.error(error);
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


      & .tip {
        font-size: 16px;
        align-self: baseline;
        em {
          color: #1DD186;
          font-style: normal;
        }
      }
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
