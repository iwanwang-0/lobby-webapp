<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Deposit A New Incentive
      </span>
    </div>

    <div class="content">
      <div class="content-row first-row">
        <div class="first-row-left">
          <div class="form-field">
            <label class="field-label" for="">Select Vote Choice:</label>
            <!-- <div class="input-wrapper"> -->
              <CuSelect
                class="cu-select"
                :options="options1"
              />
            <!-- </div> -->
          </div>
        </div>
        <div class="first-row-right">
          <div class="form-field">
            <label class="field-label" for="">Select Reward Token:</label>
            <CuSelect
              class="cu-select"
              :options="options1"
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
            </CuSelect>
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="form-field">
          <label class="field-label" for="">Enter Rewards Amount:</label>
          <div class="input-wrapper">
            <span class="input-helper">Total Rewards</span>

            <span class="icon-wrapper">
              <img src="~@/assets/img/token/ETH@2x.png" alt="">
            </span>
            <input type="text">
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="form-field">
          <label class="field-label" for="">The maximum reward is available:</label>
          <div class="input-wrapper">
            <span class="icon-wrapper">
              <img src="~@/assets/img/token/ETH@2x.png" alt="">
            </span>
            <input type="text">
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="form-field">
          <label class="field-label" for=""></label>
          <!-- <div class="input-wrapper"> -->
            <b-button
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
import CuSelect from '@/components/CuSelect';
import bnbIcon from '@/assets/img/token/BNB@2x.png';
import ethIcon from '@/assets/img/token/ETH@2x.png';
import usdtIcon from '@/assets/img/token/USDT@2x.png';

export default {
  components: {
    CuSelect,
  },

  data() {
    return {
      options1: [
        {
          label: 'ETH',
          value: 'ETH',
          icon: ethIcon,
        },
        {
          label: 'USDT',
          value: 'USDT',
          icon: usdtIcon,
        },
        {
          label: 'BNB',
          value: 'BNB',
          icon: bnbIcon,
        },
      ],
    };
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
