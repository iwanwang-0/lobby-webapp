<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        List
      </span>
      <div class="header-right">

        <b-button
          class="link-btn"
          :variant="voteType === 'VeCRV' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="changeVoteType('VeCRV')"

        >
          VeCRV
        </b-button>
        <b-button
          class="link-btn"
          :variant="voteType === 'VlCVX' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="changeVoteType('VlCVX')"
        >
          VlCVX
        </b-button>

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
      >
        <template v-slot:operation="{ row }">
          <!-- {{ row }} -->
          <CuButton
            variant="link"
            :disabled="submitting"
            @click="() => {
              onClaim({
                amount: row.amount,
                tAddr: row.tAddr,
                round: row.round
              })
            }"
          >
            Vote
          </CuButton>
        </template>
      </TableList>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { BigNumber, utils } from 'ethers';
import TableList from '@/components/TableList';
import RoundSelect from '@/components/RoundSelect';
import CuButton from '@/components/CuButton';
import CuSelect from '@/components/CuSelect';

import { getRewardTree } from '@/api/common';
import sendTransaction from '@/common/sendTransaction';
import config from '@/config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

import {
  getERC20Contract, MultiMerkleStashContract, MultiMerkleStashInterface, provider, VotiumVeCRVContract, VotiumVeCRVInterface,
} from '@/eth/ethereum';

export default {
  components: {
    TableList,
    RoundSelect,
    CuButton,
    CuSelect,
  },

  data() {
    return {
      forwardAddress: '',
      cols: [
        {
          title: 'Sort',
          prop: 'Sort',
        },
        {
          title: 'Pool',
          prop: 'Pool',
        },
        {
          title: 'Apr',
          prop: 'Apr',
        },
        {
          title: '$/veCVX',
          prop: '$/veCVX',
        },
        {
          title: 'Rewards',
          prop: 'Rewards',
        },

        {
          title: 'Vote number',
          prop: 'VoteNumber',
        },

        {
          title: 'Operation',
          prop: 'operation',
        },
      ],
      list: [
        {
          Sort: '1',
          Pool: 'ETH-alETH',
          Apr: '30%',
          Rewards: '158.87 $CRV',
          VoteNumber: '22',
          operation: '',
        },
        {
          Sort: '2',
          Pool: 'ETH-alETH',
          Apr: '30%',
          Rewards: '158.87 $CRV',
          VoteNumber: '22',
          operation: '',
        },
      ],
      voteType: 'VeCRV',

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
  },

  created() {
    // this.getReward();
  },

  methods: {
    selectChange() {
      this.getReward();
    },

    changeVoteType(type) {
      this.voteType = type;
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

    async onClaim({ amount, tAddr, round }) {
      // const { tokenId } = this.$route.query;
      // const { amount } = this;
      // if (amount < this.min) {
      //   this.showError(`The minimum claim is ${this.min} DOGE`);
      //   return;
      // }

      console.log(amount, tAddr, round);
      this.submitting = true;
      try {
        // const tree = StandardMerkleTree.load(content);

        const proof = await this.getProof(tAddr, round);

        // let proof = '';
        // // eslint-disable-next-line no-restricted-syntax
        // for (const [i, v] of tree.entries()) {
        //   if (v[0].toLowerCase() === this.user.address.toLowerCase()) {
        //     proof = tree.getProof(i);
        //   }
        // }

        console.log(proof);
        const txHash = await sendTransaction({
          to: config.MultiMerkleStash,
          gas: 640000,
          data: MultiMerkleStashInterface.encodeFunctionData('claim', [
            tAddr,
            round,
            this.user.address,
            amount,
            proof,
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
          // this.amount = '';
          this.getReward();
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
    async getTokenInfo(tokenAddress) {
      try {
        const erc20Contract = getERC20Contract(tokenAddress);

        const [symbol, decimals] = await Promise.all([
          erc20Contract.symbol(),
          erc20Contract.decimals(),
          // erc20Contract.balanceOf(this.user.address),
          // erc20Contract.allowance(
          //   this.user.address,
          //   config.VotiumVeCRV,
          // ),
        ]);
        if (symbol) {
          return {
            symbol,
            decimals,
          };
        }
        return null;
      } catch (error) {
        return null;
        // this.symbol = '';
        // this.decimals = '';
        // this.balance = '';
        // this.allowance = '';
        // this.isApproved = false;
      }
    },

    openForward() {
      this.$refs['my-modal'].show();
    },

    async getReward() {
      this.loading = true;
      this.list = [];
      const tempList = [];
      const tree = await getRewardTree();
      this.rewardTree = Object.freeze(tree);
      if (tree) {
        Object.keys(tree).forEach((tAddr) => {
          const tokenDetail = tree[tAddr];
          tokenDetail.values.forEach((item) => {
            const { treeIndex, value: [round, uAddr, amount] } = item;
            if (parseInt(round, 10) === this.round && uAddr.toLowerCase() === this.user.address) {
              tempList.push({
                treeIndex,
                round,
                uAddr,
                tAddr,
                amount,
              });
            }
          });
        });
        // console.log(tree);
        // console.log(this.list);
        const infoList = await Promise.all(tempList.map((item) => this.getTokenInfo(item.tAddr)));

        for (let i = 0; i < tempList.length; i++) {
          tempList[i].symbol = infoList[i].symbol;
          tempList[i].decimals = infoList[i].decimals;
          tempList[i].rewards = tempList[i].amount / 10 ** infoList[i].decimals;
        }

        this.list = tempList;
      }

      this.loading = false;
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
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-right {
      display: flex;
      align-items: center;

      // .cu-select {
      //   border: none;
      // }
      .link-btn {
        margin-right: 30px;
        width: 130px;
        height: 50px;
      }
    }

  }
  .content {
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}

</style>
