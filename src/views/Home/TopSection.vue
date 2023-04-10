<template>
   <b-container class="home" fluid="lg">
    <div class="left">
      <div class="banner">
        <!-- <div class="banner-row-1">Professional one-stop</div> -->
        <div class="banner-row-2">Lobby DAO</div>
        <div class="banner-row-3">the all-in-one solution for the modern DeFi enthusiast!</div>
        <div class="banner-desc">
          <!-- Support token pledge, bribery voting, -->
          Empower your vote,
          <br>
          <!-- Vetokne voting, -->
          compound your yeilds,
          <br>
          <!-- reward forwarding, -->
          and ignite liquidity.
          <!-- <br>
          and will support more POS mechanism project staking voting -->
        </div>
      </div>
      <div class="btn-group">
        <div class="btn-wrapper">
         <CuButton
           @click="onVote">Vote</CuButton>
        </div>
        <div class="btn-wrapper">
          <CuButton  @click="onBribe">Bribe</CuButton>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="block right-title">
        Operation steps
      </div>
      <div class="block right-row">
        <div class="label">
          <span class="number">1</span>
          <br>
          Step
        </div>
        The Comprehensive Bribery Voting Aggregation feature - An essential tool for anyone who wants to ensure that their vote counts.
      </div>
      <div class="block right-row">
        <div class="label">
          <span class="number">2</span>
          <br>
          Step
        </div>
        With just a few clicks, you can convert your $CRV/$CVX tokens into other tokens and save on gas fees.
      </div>
      <div class="block right-row">
        <div class="label">
          <span class="number">3</span>
          <br>
          Step
        </div>
        With Our liquidity catalyst, LOBBY could match your bribery, so bribery here!
      </div>
    </div>
  </b-container>
</template>

<script>
import CuButton from '@/components/CuButton';

export default {
  components: {
    CuButton,
  },
  data() {
    return {

    }
  },

  methods: {
    onVote() {
      this.$router.push('/vote');
    },
    onBribe() {
      this.$router.push('/bribe');
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.home {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-columns: 700px 500px;
  height: 553px;
  .left {
    display: grid;
    border-right: 1px solid $border-color;
    grid-template-rows: 480px 72px;
    // padding-left: 10px;
    font-family: "ChillPixels Mono";

    .banner {
      padding-left: 10px;
      background: url('~@/assets/img/home-bg@2x.png') center / 100% auto no-repeat;
    }
    .banner-row-1 {
      margin-top: 80px;
      height: 60px;
      line-height: 60px;
      font-size: 48px;
      background: linear-gradient(192deg, #FF6739 0%, #FFA42D 44%, #1DD186 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .banner-row-2 {
      margin-top: 80px;
      font-size: 80px;
      width: 500px;
      // height: 80px;
      // line-height: 80px;
      background: linear-gradient(192deg, #FFA42D 0%, #1DD186 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .banner-row-3 {
      margin-top: 16px;
      font-size: 36px;
      // height: 40px;
      // line-height: 36px;
      font-weight: normal;
      background: linear-gradient(192deg, #FF6739 0%, #FFA42D 44%, #1DD186 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .banner-desc {
      font-size: 18px;
      margin-top: 32px;
      color: #DCDCDC;
    }

    & .btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: 1px solid $border-color;
      & .btn-wrapper:first-child {
        border-right: 1px solid $border-color;
      }

      & .btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
      }

      & .btn {
        font-size: 18px;
      }
      & .bribe-btn {
        height: 24px;
      }
    }
  }

  .right {
    display: grid;
    grid-template-rows: 131px repeat(3, 140px);
    & .right-title {
      font-weight: normal;
      color: #64D98A;
      font-size: 48px;
      background: linear-gradient(200deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      padding-top: 22px;
      font-family: "ChillPixels Maximal";
    }

    & > .block {
      padding-left: 8px;
      padding-right: 8px;
      & .label {
        flex-shrink: 0;
        width: 68px;
        margin-right: 20px;
        color: #1DD186;
        font-size: 24px;
        text-align: center;

        & .number {
          font-size: 36px;
        }
      }
      &  + .block {
        border-top:  1px solid $border-color;
      }
    }

    .right-row {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
  }
}
</style>
