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
        <template v-slot:operation="{ row }">
          <!-- {{ row }} -->
          <CuButton
            variant="link"
            :disabled="submitting"
            @click.stop="() => {
              this.$router.push('/vote-edit')
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

import { getCrvRewardTree } from '@/api/common';
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
  },

  data() {
    return {

      round: 0,
      roundOptions: [
        {
          label: 0,
          value: 0,
        },
        {
          label: 1,
          value: 1,
        }, {
          label: 2,
          value: 2,
        }, {
          label: 3,
          value: 3,
        },
      ],

      forwardAddress: '',
      cols: [
        {
          title: 'Round',
          prop: 'Round',
        },
        {
          title: 'Pool',
          prop: 'Pool',
        },
        {
          title: 'Quantity veCRV',
          prop: 'Quantity veCRV',
        },
        {
          title: 'Time',
          prop: 'Time',
        },
      ],
      list: [
        {
          Round: '1',
          Pool: 'ETH-alETH',
          Apr: '30%',
          'Quantity veCRV': '158.87 $CRV',
          Time: '2023/1/2',
        },
        {
          Round: '2',
          Pool: 'ETH-alETH',
          Apr: '30%',
          'Quantity veCRV': '158.87 $CRV',
          Time: '2023/1/2',
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
      const tree = await getCrvRewardTree();
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
