<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Deposit A New Incentive
      </span>
    </div>
    <!-- {{ cvxChoices }} -->
    <div class="content">
      <div class="content-row first-row">
        <div class="first-row-left">
          <div class="form-field">
            <label class="field-label" for="">Select Vote Choice:</label>
            <!-- <div class="input-wrapper"> -->
              <CuSelect
                class="cu-select"
                :options="choices"
                v-model="gauge"
              />
            <!-- </div> -->
          </div>
        </div>
        <div class="first-row-right">
          <div class="form-field">
            <label class="field-label"  style="width: 180px" for="">Reward Token:</label>

            <div class="input-wrapper">
              <!-- <span class="input-helper">Total Rewards</span> -->

              <!-- <span v-if="selectedToken" class="icon-wrapper">
                <img :src="selectedToken.icon" alt="">
              </span> -->
              <input type="text"
                v-model="tokenAddress"
              >
            </div>

            <!-- <CuSelect
              class="cu-select"
              :options="veCRVOptions"
              @change="onTokenChange"
            >
              <template v-slot:selected="{ option }">
                <span v-if="option">
                  <img style="width: 28px; margin-right: 15px" :src="option.icon">
                  {{ option.label }}
                </span>
                <span v-else>
                  Please select
                </span>
              </template>
              <template v-slot:option="{ option }">
                <img style="width: 28px; margin-right: 15px" :src="option.icon">
                {{ option.label }}
              </template>
            </CuSelect> -->
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="form-field">
          <label class="field-label" for="">Enter Rewards Amount:</label>
          <div class="input-wrapper">
            <span class="input-helper">Total Rewards</span>

            <span v-if="symbol" class="icon-wrapper">
              {{ symbol }}
            </span>
            <!-- <span v-if="selectedToken" class="icon-wrapper">
              <img :src="selectedToken.icon" alt="">
            </span> -->
            <input type="text"
              v-model="totalRewards"
            >
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="form-field">
          <label class="field-label" for="">The maximum reward is available:</label>
          <div class="input-wrapper">
            <!-- <span  v-if="selectedToken" class="icon-wrapper">
              <img :src="selectedToken.icon" alt="">
            </span> -->
            <span  v-if="symbol" class="icon-wrapper">
              {{ symbol }}
            </span>
            <input type="text"
              v-model="maxReward"
            >
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="form-field">
          <label class="field-label" for=""></label>
          <!-- <div class="input-wrapper"> -->
            <b-button
              v-if="user.address"
              size="sm"
              class="form-btn"
              variant="link"
              :disabled="!symbol || submitting || (voteType === 'VeCRV' && isCrvApproved) || (voteType === 'VlCVX' && isCvxApproved)"
              @click="onApprove"
            >
            Approve Token</b-button>

            <b-button
              v-if="user.address"
              size="sm"
              class="form-btn"
              variant="link"
              :disabled="!symbol || submitting || (voteType === 'VeCRV' && !isCrvApproved) || (voteType === 'VlCVX' && !isCvxApproved)"
              @click="onBribe"
            >
            Bribe</b-button>
            <b-button
              v-if="!user.address"
              size="sm"
              class="form-btn"
              variant="link"
            >
            Wallet connect</b-button>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'lodash';
import config from '@/config';
import { BigNumber, utils } from 'ethers';
import sendTransaction from '@/common/sendTransaction';
import {
  getERC20Contract, getERC20Interface, provider, VotiumVeCRVContract, VotiumVeCRVInterface,
  VotiumBribeCVXContract,
  VotiumBribeCVXInterface,
} from '@/eth/ethereum';

import CuSelect from '@/components/CuSelect.vue';
// import bnbIcon from '@/assets/img/token/BNB@2x.png';
// import ethIcon from '@/assets/img/token/ETH@2x.png';
// import usdtIcon from '@/assets/img/token/USDT@2x.png';

import { getAllGauges } from '@/api/curve';

export default {
  props: {
    selectedRound: {
      type: Object,
    },
    voteType: {
      type: String,
    },
  },
  components: {
    CuSelect,
  },

  data() {
    return {
      selectedToken: null,
      submitting: false,

      gauge: '',
      tokenAddress: '',
      totalRewards: '',
      maxReward: '',

      symbol: '',
      decimals: '',
      balance: '',

      crvAllowance: '',
      isCrvApproved: false,
      cvxAllowance: '',
      isCvxApproved: false,
    };
  },
  computed: {
    ...mapState(['user', 'crvList']),
    ...mapState(['cvxChoices', 'proposal', 'crvChoices']),

    choices() {
      if (this.voteType === 'VeCRV') {
        return this.crvList.map((item) => ({
          label: item.name,
          value: item.address,
        }));
      }
      return this.cvxChoices;
    },
  },

  watch: {
    tokenAddress() {
      this.getTokenInfoDebounce();
    },
    voteType() {
      this.gauge = '';
    },
  },

  created() {
    // this.getAllGauges();
  },

  methods: {
    onTokenChange(option) {
      this.selectedToken = option;
    },

    async getTokenInfo() {
      try {
        if (!this.tokenAddress || !utils.isAddress(this.tokenAddress)) {
          // this.showError('Token address invalid');
          return;
        }

        const erc20Contract = getERC20Contract(this.tokenAddress);

        const [symbol, decimals, balance] = await Promise.all([
          erc20Contract.symbol(),
          erc20Contract.decimals(),
          erc20Contract.balanceOf(this.user.address),
        ]);

        if (symbol) {
          this.symbol = symbol;
          this.decimals = decimals;
          this.balance = balance;
        } else {
          this.symbol = '';
          this.decimals = '';
          this.balance = '';
        }
      } catch (error) {
        this.symbol = '';
        this.decimals = '';
        this.balance = '';
      }
    },

    async getApproveInfo() {
      try {
        if (!this.tokenAddress || !utils.isAddress(this.tokenAddress)) {
          // this.showError('Token address invalid');
          return;
        }

        const erc20Contract = getERC20Contract(this.tokenAddress);

        if (this.voteType === 'VeCRV') {
          const crvAllowance = await erc20Contract.allowance(
            this.user.address,
            config.VotiumVeCRV,
          );
          if (crvAllowance.gt(1 + '0'.repeat(24))) {
            this.crvAllowance = crvAllowance;
            this.isCrvApproved = true;
          } else {
            this.crvAllowance = '';
            this.isCrvApproved = false;
          }
        } else {
          const cvxAllowance = await erc20Contract.allowance(
            this.user.address,
            config.VotiumBribeCVX,
          );
          if (cvxAllowance.gt(1 + '0'.repeat(24))) {
            this.cvxAllowance = cvxAllowance;
            this.isCvxApproved = true;
          } else {
            this.cvxAllowance = '';
            this.isCvxApproved = false;
          }
        }
      } catch (error) {
        this.crvAllowance = '';
        this.isCrvApproved = false;
        this.cvxAllowance = '';
        this.isCvxApproved = false;
      }
    },
    // eslint-disable-next-line func-names
    getTokenInfoDebounce: debounce(function () {
      this.getTokenInfo();
      this.getApproveInfo();
    }, 500),

    async onApprove() {
      this.submitting = true;

      if (!this.tokenAddress || !utils.isAddress(this.tokenAddress)) {
        // this.showError('Token address invalid');
        return;
      }

      const erc20Interface = getERC20Interface(this.tokenAddress);

      try {
        let approveTxHash;
        if (this.voteType === 'VeCRV') {
          approveTxHash = await sendTransaction({
            to: this.tokenAddress,
            gas: 80000,
            data: erc20Interface.encodeFunctionData('approve', [
              config.VotiumVeCRV,
              BigNumber.from(1 + '0'.repeat(30)).toHexString(),
            ]),
          });
        } else {
          approveTxHash = await sendTransaction({
            to: this.tokenAddress,
            gas: 80000,
            data: erc20Interface.encodeFunctionData('approve', [
              config.VotiumBribeCVX,
              BigNumber.from(1 + '0'.repeat(30)).toHexString(),
            ]),
          });
        }

        this.showPending('Pending', {
          tx: approveTxHash,
        });
        const approveTx = await provider.waitForTransaction(approveTxHash);

        if (approveTx.status !== 1) {
          this.showError('Approve fail，please retry');
          this.submitting = false;
        } else {
          // this.showSuccess('Approve success');
          this.showSuccess('Success', {
            tx: approveTxHash,
          });

          if (this.voteType === 'VeCRV') {
            this.crvAllowance = BigNumber.from(1 + '0'.repeat(30)).toHexString();
            this.isCrvApproved = true;
          } else {
            this.cvxAllowance = BigNumber.from(1 + '0'.repeat(30)).toHexString();
            this.isCvxApproved = true;
          }

          this.getApproveInfo();
        }
      } finally {
        this.submitting = false;
      }
    },

    async onBribe() {
      if (!this.selectedRound) {
        this.showError('Please select round');
        return false;
      }
      if (!this.user.address) {
        this.showError('Please connect metamask');
        return false;
      }

      const {
        gauge, tokenAddress, totalRewards, maxReward,
      } = this;

      // console.log(gauge, tokenAddress, totalRewards, maxReward)

      if (gauge == null || !tokenAddress || !totalRewards || !maxReward) {
        this.showError('The form field is error');
        return;
      }

      this.submitting = true;

      const erc20Contract = getERC20Contract(this.tokenAddress);

      const tokenBalance = await erc20Contract.balanceOf(this.user.address);

      if (tokenBalance.lt(totalRewards + '0'.repeat(this.decimals))) {
        this.showError('You balance is not enough');
        this.submitting = false;
        return false;
      }

      try {
        let buyTxHash;
        if (this.voteType === 'VeCRV') {
          buyTxHash = await sendTransaction({
            to: config.VotiumVeCRV,
            gas: 640000,
            data: VotiumVeCRVInterface.encodeFunctionData('depositReward', [
              this.tokenAddress,
              BigNumber.from(totalRewards + '0'.repeat(this.decimals)).toHexString(),
              BigNumber.from(this.selectedRound.time.valueOf() / (7 * 24 * 60 * 60 * 1000)).toHexString(),
              this.gauge,
            ]),
          });
        } else {
          buyTxHash = await sendTransaction({
            to: config.VotiumBribeCVX,
            gas: 640000,
            data: VotiumBribeCVXInterface.encodeFunctionData('depositBribe', [
              this.tokenAddress,
              BigNumber.from(totalRewards + '0'.repeat(this.decimals)).toHexString(),
              this.proposal.id,
              this.gauge,
            ]),
          });
        }
        this.showPending('Pending', {
          tx: buyTxHash,
        });

        const buyTx = await provider.waitForTransaction(buyTxHash);

        if (buyTx.status === 1) {
          this.showSuccess('Success', {
            tx: buyTxHash,
          });
          this.amount = '';
        } else {
          this.showError('Faild', {
            tx: buyTxHash,
          });
        }
      } finally {
        this.submitting = false;
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
  border-bottom: 1px solid $border-color;
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
    display: grid;
    grid-template-rows: repeat(3, 88px);
    // height: 317px;
    & .content-row {
      border-top: 1px dashed $border-color;
      // display: flex;
      // align-items: center;
    }

    & .first-row {
      display: grid;
      border-top: none;
      grid-template-columns: 609px 589px;
      & > div:first-child {
        border-right: 1px dashed $border-color;
      }
    }

    & .form-field {
      display: flex;
      height: 88px;
      align-items: center;
      padding: 10px;
    }

    & .field-label {
      color: #999999;
      font-size: 18px;
      width: 270px;
      line-height: 18px;
      flex-shrink: 0;
    }

    & .input-wrapper {
      height: 60px;
      border: 1px solid #4C4C4C;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      flex-grow: 1;
      position: relative;
    }

    & .input-helper {
      position: absolute;
      left: 20px;
      top: -14px;
      font-size: 16px;
      color: #999999;
      background: #000;
      padding: 0 8px;
    }

    & .icon-wrapper {
      margin-right: 8px;
      color: #999;
      & img {
        width: 28px;
        height: 28px;
      }
    }

    & input {
      appearance: none;
      border: 0;
      background: transparent;
      outline: none;
      color: #CCCCCC;
      padding: 0;
      font-size: 18px;
      width: 100%;
    }

    & .cu-select {
      height: 60px;
      width: 100%;
    }

    & .form-btn {
      font-weight: bold;
      font-size: 18px;
    }

  }
}
</style>
