<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        List
      </span>
      <div class="header-right">
        <!-- <b-button
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
        </b-button> -->

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
        :is-expand="true"
      >
        <template v-slot:operation="{ row }">
          <!-- {{ row }} -->
          <CuButton
            variant="link"
            :disabled="submitting"
            @click.stop="onVote"
          >
            Vote
          </CuButton>
        </template>

        <template v-slot:expandPanel="{ row }">
          <div class="row1">
            <div>
              You vote weight:
              <em>0.1%</em>
            </div>
            <div>
              You reward :
              <em>123,235 veCRV</em>
            </div>
            <div>
              <CuButton
                variant="link"
                class="claim-btn"
                :disabled="submitting"
                size="min"
              >
                claim
              </CuButton>
            </div>
          </div>
          <div class="row2">
            <div class="expand-item">
              <div class="label">Max reward per veCRV</div>
              <div class="content">0.12 CRV</div>
            </div>
            <div class="expand-item">
              <div class="label">Remaining claimable rewards</div>
              <div class="content">122,345.33 CRV</div>
            </div>
            <div></div>
            <div></div>

            <div class="expand-item">
              <div class="label">First voting period</div>
              <div class="content">February 9, 2023 8:00 am</div>
            </div>
            <div class="expand-item">
              <div class="label">Last voting period</div>
              <div class="content">March 30, 2023 8:00 am</div>
            </div>
            <div class="expand-item">
              <div class="label">First week of claim</div>
              <div class="content">February 16, 2023 8:00 am</div>
            </div>
            <div class="expand-item">
              <div class="label">Last week of claim</div>
              <div class="content">February 16, 2023 8:00 am</div>
            </div>
            <div class="expand-item">
              <div class="label">Contracts</div>
              <div class="content">0.12 CRV</div>
            </div>
            <div class="expand-item">
              <div class="label">&nbsp;</div>
              <div class="content">0.12 CRV</div>
            </div>
            <div class="expand-item">
              <div class="label">&nbsp;</div>
              <div class="content">0.12 CRV</div>
            </div>
          </div>
        </template>
      </TableList>
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
import { mapState } from 'vuex';
import { BigNumber, utils } from 'ethers';
import TableList from '@/components/TableList';
import CuButton from '@/components/CuButton';
import CuPagination from '@/components/CuPagination';
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
    CuButton,
    CuSelect,
    CuPagination,
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
        {
          Sort: '3',
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
    onVote() {
      this.$router.push('/vote-edit');
    },
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

        const proof = await this.getProof(tAddr, round);

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
  // grid-template-rows: 130px auto 100px;
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

      .link-btn {
        margin-right: 30px;
        width: 130px;
        height: 50px;
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
