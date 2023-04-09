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
        :cols="cols"
        :list="innerList"
        :loading="loading"
        :submitting="submitting"
        :is-expand="false"
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
import RoundSelect from '@/components/RoundSelect';
import CuPagination from '@/components/CuPagination';
import CuSelect from '@/components/CuSelect';

import { vote } from '@/api/snapshot';
import sendTransaction from '@/common/sendTransaction';
import config from '@/config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

import {
  getERC20Contract, MultiMerkleStashContract, MultiMerkleStashInterface, provider, VotiumVeCRVContract, VotiumVeCRVInterface,
} from '@/eth/ethereum';
import VoteList from './VoteList';

export default {
  components: {
    VoteList,
    CuButton,
    // CuSelect,
    RoundSelect,
    CuPagination,
  },

  props: {
    voteType: {
      type: String,
    },
  },

  data() {
    return {
      cols: [
        {
          title: 'Sort',
          prop: 'sort',
        },
        {
          title: 'Pool',
          prop: 'pool',
        },
        {
          title: 'Apr',
          prop: 'Apr',
        },
        {
          title: 'Weight',
          prop: 'weight',
        },
        {
          title: 'New Weight',
          prop: 'newWeight',
          isEdit: true,
          width: 350,
          opBtn: 'Best Option',
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

      innerList: [],

      market: 'All',
      marketOption: [
        {
          label: 'All',
          value: 'All',
        },
        {
          label: 'Votium',
          value: 'Votium',
        },
        {
          label: 'yBribe',
          value: 'yBribe',
        }, {
          label: 'VoteMarket',
          value: 'VoteMarket',
        },
      ],

      submitting: false,
      loading: false,

      rewardTree: null,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['roundOptions']),
    ...mapState(['cvxChoices', 'proposal']),
    voteList() {
      if (this.voteType === 'VeCRV') {
        return [];
      }
      return this.cvxChoices.map((item, idx) => ({
        sort: idx,
        pool: item.replace(/\(.*\)/, ''),
        weight: 0,
        newWeight: 0,
        percent: 0,
      }));
    },

  },

  watch: {
    voteList: {
      handler() {
        this.innerList = cloneDeep(this.voteList);
      },
      immediate: true,
    },
  },

  created() {
    // this.getReward();
  },

  methods: {
    selectChange() {
      this.getReward();
    },

    getProof(tAddr, round) {
      const content = this.rewardTree[tAddr];
      const tree = StandardMerkleTree.load(content);
      // eslint-disable-next-line no-restricted-syntax
      for (const [i, v] of tree.entries()) {
        console.log([i, v]);
        if (v[0] === round && v[1].toLowerCase() === this.user.address.toLowerCase()) {
          const proof = tree.getProof(i);
          console.log(proof);
          return proof;
          // return tree.getProof(i);
        }
      }
      return '';
    },

    async onVoteAll() {
      this.submitting = true;

      // console.log()

      const choiceMap = this.innerList.reduce((choices, item, idx) => {
        choices[idx] = Number.parseInt(item.newWeight, 10) || 0;
        return choices;
      }, {});

      try {
        const txHash = await vote({
          account: this.user.address,
          proposal: this.proposal.id,
          choice: choiceMap,
        });

        // console.log(txHash);
        this.showPending('Pending', {
          tx: txHash,
        });

        // const proof = await this.getProof(tAddr, round);

        // const txHash = await sendTransaction({
        //   to: config.MultiMerkleStash,
        //   gas: 640000,
        //   data: MultiMerkleStashInterface.encodeFunctionData('claim', [
        //     tAddr,
        //     round,
        //     this.user.address,
        //     amount,
        //     proof,
        //   ]),
        // });

        // this.showPending('Pending', {
        //   tx: txHash,
        // });

        const buyTx = await provider.waitForTransaction(txHash);

        if (buyTx.status === 1) {
          this.showSuccess('Succeeded', {
            tx: txHash,
          });
          // this.getReward();
          // this.$store.dispatch('getPosition');
          // this.$store.dispatch('getWithdrawable');
          // this.$store.dispatch('getBalances');
        } else {
          this.showError('Failed', {
            tx: txHash,
          });
        }
      } catch (error) {
        console.error(error);
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

        // const proof = await this.getProof(tAddr, round);

        // const txHash = await sendTransaction({
        //   to: config.MultiMerkleStash,
        //   gas: 640000,
        //   data: MultiMerkleStashInterface.encodeFunctionData('claim', [
        //     tAddr,
        //     round,
        //     this.user.address,
        //     amount,
        //     proof,
        //   ]),
        // });

        // this.showPending('Pending', {
        //   tx: txHash,
        // });

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
        console.error(error);
      }
      this.submitting = false;
    },

    // async getTokenInfo(tokenAddress) {
    //   try {
    //     const erc20Contract = getERC20Contract(tokenAddress);

    //     const [symbol, decimals] = await Promise.all([
    //       erc20Contract.symbol(),
    //       erc20Contract.decimals(),
    //       // erc20Contract.balanceOf(this.user.address),
    //       // erc20Contract.allowance(
    //       //   this.user.address,
    //       //   config.VotiumVeCRV,
    //       // ),
    //     ]);
    //     if (symbol) {
    //       return {
    //         symbol,
    //         decimals,
    //       };
    //     }
    //     return null;
    //   } catch (error) {
    //     return null;
    //   }
    // },

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
