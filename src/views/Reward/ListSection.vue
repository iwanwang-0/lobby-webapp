<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Details
      </span>

      <div class="header-right">

        <CuSelect
          class="type-select"
          type="simple"
          :options="typeOptions"
          v-model="type"
        >

        </CuSelect>
        <b-button
          class="link-btn"
          variant="link"
          style="color: #fff;  box-shadow: none;"
          @click="openForward"
        >
          Forward rewards
        </b-button>

        <CuButton
          class="link-btn"
          variant="link"
          :disabled="submitting"
          @click="() => {
              onClaimAll()
            }"
        >
          Claim all
        </CuButton>

        <!-- <b-button
          class="link-btn"
          variant="link"
        >
          Claim all <img style="width: 18px;" src="~@/assets/img/right-arrow@2x.png" alt="">
        </b-button> -->

        <RoundSelect
          :options="rewordRoundOptions"
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
            Claim
          </CuButton>
        </template>
      </TableList>
    </div>
    <b-modal size="lg" ref="my-modal" modal-class="forword-modal" hide-footer title="Forward rewards">
      <div class="input-wrapper">
        <input
          type="text"
          v-modal="forwardAddress"
          placeholder="Receive reward address…"
        >
      </div>
      <div class="button-wrapper">
        <CuButton
          variant="link"
        >
          Submit
        </CuButton>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { BigNumber, utils } from 'ethers';
import TableList from '@/components/TableList';
import RoundSelect from '@/components/RoundSelect';
import CuSelect from '@/components/CuSelect';
import CuButton from '@/components/CuButton';
import { getCvxRewardTree, getCrvRewardTree } from '@/api/common';
import sendTransaction from '@/common/sendTransaction';
import config from '@/config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import toFixed from '@/filters/toFixed';

import {
  getERC20Contract, MultiMerkleStashContract, MultiMerkleStashInterface, provider, VotiumVeCRVContract, VotiumVeCRVInterface,
} from '@/eth/ethereum';
import { WEEK_SECONDS, CRV_START_SECONDS, CVX_START_SECONDS } from '@/constants/time';


export default {
  components: {
    TableList,
    RoundSelect,
    CuButton,
    CuSelect,
  },

  data() {
    return {

      typeOptions: [
        {
          label: 'VeCRV',
          value: 'VeCRV',
        },
        {
          label: 'VlCVX',
          value: 'VlCVX',
        },
      ],

      type: 'VeCRV',

      forwardAddress: '',
      cols: [
        {
          title: 'Round',
          prop: 'round',
        },
        {
          title: 'Token',
          prop: 'symbol',
        },
        {
          title: 'Rewards',
          prop: 'rewards',
        },
        {
          title: 'Operation',
          prop: 'operation',
        },
      ],
      list: [],
      round: 0,

      submitting: false,
      loading: false,

      rewardTree: null,

      rewordRoundOptions: [],
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['roundOptions']),
  },

  watch: {
    // roundOptions: {
    //   handler() {
    //     if (this.roundOptions && this.roundOptions[0]) {
    //       this.round = this.roundOptions[0].value;
    //     }
    //   },
    //   immediate: true,
    // },
    type: {
      handler() {
        this.getReward();
      },
    },
  },

  created() {
    this.getReward();
    // console.log(this.roundOptions[0])
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
        if (v[0] === round && v[1].toLowerCase() === this.user.address.toLowerCase()) {
          const proof = tree.getProof(i);
          return proof;
        }
      }
      return '';
    },

    async onClaimAll() {
      this.submitting = true;
      // const tAddr = this.user.address;
      try {
        const params = this.list.map((item) => {
          const proof = this.getProof(item.tAddr, item.round);
          return {
            token: item.tAddr,
            index: item.round,
            amount: item.amount,
            merkleProof: proof,
          };
        });
        const txHash = await sendTransaction({
          to: config.MultiMerkleStash,
          gas: 640000,
          data: MultiMerkleStashInterface.encodeFunctionData('claimMulti', [
            this.user.address,
            params,
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

    async onClaim({ amount, tAddr, round }) {
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
            BigNumber.from(amount).toHexString(),
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
      let tree = {};

      if (this.type === 'VeCRV') {
        tree = await getCrvRewardTree();
      } else {
        tree = await getCvxRewardTree();
      }

      this.rewardTree = Object.freeze(tree);

      const roundOptionsSet = new Set();
      if (tree) {
        Object.keys(tree).forEach((tAddr) => {
          const tokenDetail = tree[tAddr];
          tokenDetail.values.forEach((item) => {
            const { value: [round, uAddr] } = item;
            if (uAddr.toLowerCase() === this.user.address) {
              roundOptionsSet.add(round / WEEK_SECONDS);
            }
          });
        });

        if (roundOptionsSet.size === 0) {
          this.rewordRoundOptions = [{
            label: '-',
            value: '-',
          }];
          this.round = '-';
        } else {
          const crvStartRound = Math.floor(CRV_START_SECONDS / WEEK_SECONDS);
          const cvxStartRound = Math.floor(CVX_START_SECONDS / WEEK_SECONDS);

          this.rewordRoundOptions = [...roundOptionsSet].sort((a, b) => b - a).map((item) => {
            let label = '';
            if (this.type === 'VeCRV') {
              label = item - crvStartRound;
            } else {
              label = Math.floor((item - cvxStartRound) / 2);
            }
            return {
              label,
              value: item,
            };
          });
          this.round = this.rewordRoundOptions[0].value;
        }

        Object.keys(tree).forEach((tAddr) => {
          const tokenDetail = tree[tAddr];
          tokenDetail.values.forEach((item) => {
            const { treeIndex, value: [round, uAddr, amount] } = item;
            if (parseInt(round, 10) === this.round * WEEK_SECONDS && uAddr.toLowerCase() === this.user.address) {
              tempList.push({
                treeIndex,
                round: round / WEEK_SECONDS,
                uAddr,
                tAddr,
                amount: toFixed(amount.hex, 4),
              });
            }
          });
        });

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

<style lang="scss">

.forword-modal {

  & .modal-dialog {
    margin-top: 240px;
  }
  & .modal-header {
    padding: 16px 24px 16px 10px;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // color: red;
  }
  & .modal-title {
    font-size: 36px;
    color: #64D98A;
    background: linear-gradient(200deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: ChillPixels Maximal;
  }

  .close {
    color: #ccc;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 24px;
  }

  & .modal-content {
    padding: 0;
    background: #1D1D1D;
    border: 1px solid #666666;
  }

  & .modal-body {
    padding: 1rem 0;
  }

  & .input-wrapper {
    border-top: 1px solid #666666;
    border-bottom: 1px solid #666666;
    height: 79px;
    & input {
      border: 0;
      width: 100%;
      background: transparent;
      box-shadow: none;
      outline: none;
      height: 100%;
      margin: 0;
      padding: 0;
      color: #CCCCCC;
      padding: 0 10px;
      font-size: 18px;
    }
  }

  & .button-wrapper {
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 24px;
    margin-bottom: 24px;

    & .btn {
      font-size: 24px;
    }
  }
}
</style>

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
    }

    .type-select {
      // width: 80px !important;
    }

    .link-btn {
      font-size: 18px;
      margin-right: 24px;
      font-family: ChillPixels Mono;
    }
  }
  .content {
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}
</style>
