<template>
   <b-container class="home" fluid="lg">
    <div class="left">
      <div class="title">Reward</div>
      <div class="desc">Each round of Reward will be distributed <em>48h</em> after the end of voting</div>
    </div>
    <div class="right">
      <div class="right-row">Claimable reward: <em>$123,456</em></div>
      <div class="right-row">Rewards received: <em>$123,456</em></div>
      <div class="right-row">Total Claimable Rewards: <em>$123,456</em></div>
      <div class="right-row">Total rewards received: <em>$123,456</em></div>
    </div>
  </b-container>
</template>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.home {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  display: grid;
  grid-template-columns: 669px 529px;
  height: 320px;
  .left {
    display: flex;
    border-right: 1px dashed $border-color;
    justify-content: center;
    flex-direction: column;
    padding-left: 10px;
    // grid-template-rows: 480px 72px;

    .title {
      width: 176px;
      height: 60px;
      font-size: 48px;
      font-family: ChillPixels Maximal;
      font-weight: normal;
      color: #64D98A;
      line-height: 60px;
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .desc {
      margin-top: 10px;
      width: 578px;
      height: 120px;
      font-size: 30px;
      font-family: ChillPixels Mono;
      font-weight: normal;
      color: #FFFFFF;
      line-height: 40px;
    }

    em {
      color: #1DD186;
      font-style: normal;
    }

  }

  .right {
    display: grid;
    .right-row {
      // width: 314px;
      // height: 18px;
      font-size: 18px;
      font-family: ChillPixels Mono;
      font-weight: normal;
      color: #CCCCCC;
      line-height: 18px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      & + .right-row {
        border-top: 1px dashed $border-color;
      }
    }

    em {
      color: #1DD186;
      font-style: normal;
    }
  }
}
</style>
