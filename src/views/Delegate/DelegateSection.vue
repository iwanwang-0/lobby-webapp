<template>
   <b-container class="top-section" fluid="lg">
    <div class="content">
      <div class="left">

        <div class="top">
          <div class="total">
            Total delegated: {{ delegatedVp | toFixed(2) }} vlCVX
          </div>

        <div class="title">Delegate to Lobby</div>
         <div class="row1">Delegate to Lobby, after delegating your vlCVX voting rights, Lobby will vote for you according to the best return </div>
        </div>
        <div
          class="btn-row"
          v-if="!user.address"
        >
           <cu-button
            @click="unlock"
            class="link-btn"
          >Wallet Connect</cu-button>
        </div>

        <div
          class="btn-row"
          v-if="user.address && !isDelegate"
        >
           <cu-button
            @click="onDelegate"
            class="link-btn"
            :loading="submitting"
          >Delegate to Lobby</cu-button>
          <div class="delete-tip">Your vlCVX will is not to delegate to any one</div>
        </div>

        <div
          class="btn-row"
          v-if="user.address && isDelegate"
        >
          <div class="delete-tip">Your vlCVX will is delegating to {{delegateTo || '-'}}</div>
        </div>
        <!-- <div class="title">Reward</div>
        <div class="desc">Each round of Reward will be distributed <em>48h</em> after the end of voting</div> -->
      </div>
      <!-- <div class="right">
        <div class="top">
          <div class="title">Compounding</div>
          <div class="row1">Compounding: Lobby will automatically convert your rewards into your vlCVX shares, and you can also manually cancel the automatic investment function </div>
          <div class="row2">Redem: The protocol stops converting rewards into vlCVX Voting power, you can claim rewards manually</div>
        </div>
        <div class="btn-row">
           <cu-button class="link-btn">Compounding</cu-button>
           <cu-button class="link-btn">Redeem</cu-button>
        </div>
      </div> -->
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import CuButton from '@/components/CuButton';
import sendTransaction from '@/common/sendTransaction';
import {
  provider, DelegateRegistryInterface, DelegateRegistryContract,
} from '@/eth/ethereum';
import { getTotalDelegate } from '@/api/snapshot';
import { BigNumber, utils } from 'ethers';

import config from '@/config';

export default {
  components: {
    CuButton,
  },
  data() {
    return {
      submitting: false,
      isDelegate: false,
      delegatedVp: 0,
      delegateTo: '',
    };
  },

  computed: {
    ...mapState(['user']),
  },
  watch: {
    'user.address': {
      handler() {
        console.log('ddd');
        if (this.user.address) {
          this.getDelegate();
        }
      },
      immediate: true,
    },

  },
  created() {
    this.getTotal();
  },
  methods: {
    unlock() {
      this.$store.dispatch('unlock');
    },

    // 0x0AeB03b3c5Ce641AF2C560909303C3DfdBE636ec
    async getDelegate() {
      console.log('delegate');
      const address = await DelegateRegistryContract.delegation(
        // '0x0AeB03b3c5Ce641AF2C560909303C3DfdBE636ec',
        this.user.address,
        utils.formatBytes32String(config.space),
      );
      console.log('xxxx', address);
      if (address !== '0x0000000000000000000000000000000000000000') {
        if (address.toLowerCase() === config.DelegateAddress.toLowerCase()) {
          this.delegateTo = 'Lobby';
        }

        if (address.toLowerCase() === config.DelegateVotiumAddress.toLowerCase()) {
          this.delegateTo = 'Votium';
        }
        this.isDelegate = true;
      } else {
        this.isDelegate = false;
      }
    },

    async getTotal() {
      const total = await getTotalDelegate();
      this.delegatedVp = total;
    },

    async onDelegate() {
      if (!this.user.address) {
        this.showError('Please connect metamask');
        return false;
      }

      this.submitting = true;

      try {
        const buyTxHash = await sendTransaction({
          to: config.DelegateRegistry,
          gas: 640000,
          data: DelegateRegistryInterface.encodeFunctionData('setDelegate', [
            utils.formatBytes32String(config.space),
            config.DelegateAddress,
          ]),
        });
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
      } catch (error) {
        this.showError(error.reason || error.message);
        console.dir(error);
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
  // grid-template-rows: 130px 180px;
  min-height: calc(100vh - 250px);
  // display: flex;
  // align-items: center;
  // display: grid;
}

.top {
  margin-top: 96px;
}
.content {
  display: grid;
  // grid-template-columns: 469px 729px;
  grid-template-columns: 100%;
  height: 100%;
  color: #CCCCCC;;
  font-size: 18px;
  .title {
    width: 328px;
    font-size: 36px;
    font-family: ChillPixels Maximal;
    font-weight: normal;
    color: #64D98A;
    background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 24px;
  }

  .total {
    float: right;
    margin-top: 16px;
    font-size: 14px;
    // color: #eee;
  }

  .row1 {
    margin-bottom: 48px;
  }

  .btn-row {
      margin-bottom: 96px;
    }

    .delete-tip {
      font-size: 14px;
    }

  .link-btn {
    padding: 0;
    margin-right: 40px;
  }

  .left {
    display: flex;
    // border-right: 1px dashed $border-color;
    justify-content: space-between;
    flex-direction: column;
    padding-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;

    em {
      color: #1DD186;
      font-style: normal;
    }

  }

  .right {
    // display: grid;
    // color: #CCCCCC;
    // font-size: 18px;
    // font-family: ChillPixels Mono;
    // font-weight: normal;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // justify-content: center;
    padding-left: 10px;
    padding-right: 10px;

    .title {
      width: 240px;
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .row2 {
      margin-top: 32px;
    }
    .power-text {
      font-size: 30px;
    }
    // .right-row {
    //   // width: 314px;
    //   // height: 18px;

    //   color: #CCCCCC;
    //   line-height: 18px;

    //   & + .right-row {
    //     border-top: 1px dashed $border-color;
    //   }
    // }

    em {
      color: #1DD186;
      font-style: normal;
    }
  }
}
</style>
