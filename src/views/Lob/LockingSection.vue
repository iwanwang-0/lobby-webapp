<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Locking LOB
      </span>
      <span class="address">（0xa76…Eg6FG）</span>
    </div>

    <div class="content">
      <div>
        <div class="value">358，123</div>
        <div class="label">Your Locked</div>
      </div>
      <div>
        <div class="value">0.00</div>
        <div class="label">Your vlLOBBY</div>
      </div>
      <div>
        <div class="value">67.03%</div>
        <div class="label">APY</div>
      </div>
      <div>
        <div class="value">823，786.79</div>
        <div class="label">Rewards</div>
      </div>
    </div>
    <div class="footer">
      <CuButton class="link-btn left-btn">Lock</CuButton>
      <CuButton class="link-btn">Unlock</CuButton>
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
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.top-section {
  border-top: 1px solid $border-color;
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-rows: 100px 130px 75px;
  .header {
    border-bottom: 1px dashed $border-color;
    display: flex;
    align-items: center;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    .header-text {
      width: 216px;
      font-size: 36px;
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .address {
      margin-left: 8px;
      color:  #CCCCCC;
      font-size: 30px;
    }
  }
  .content {
    border-bottom: 1px dashed $border-color;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    // height: 317px;
    & > div {
      border-left: 1px dashed $border-color;
      padding-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    & .value {
      font-size: 36px;
      font-weight: normal;
      font-family: ChillPixels Maximal;
      color: #64D98A;
    }

    & .label {
      font-size: 18px;
      font-weight: normal;
      color: #CCCCCC;
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items:center;

    & .link-btn  {
      outline: none;
      box-shadow: none;
    }
    & .left-btn {
      margin-right: 40px;
    }
  }
}
</style>
