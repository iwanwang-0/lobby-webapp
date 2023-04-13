<template>
   <b-container class="top-section" fluid="lg">
    <div class="left">
      <img src="~@/assets/img/logo-ic@2x.png" alt="">
    </div>
    <div class="right">
      <div class="title">
        Lob
      </div>
      <div class="desc">
        Automatic investment: Lobby will automatically convert your rewards into your vlCVX shares, and you can also manually cancel the automatic investment function
      </div>
    </div>
  </b-container>
</template>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.top-section {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-columns: 424px auto;
  height: 400px;
  .left {
    // display: grid;
    // border-right: 1px solid $border-color;
    // grid-template-rows: 480px 72px;
    img {
      width: 400px;
    }
  }
  .right {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    padding-top: 68px;
    .title {
      width: 89px;
      font-size: 48px;
      font-family: ChillPixels Maximal;
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .desc {
      font-size: 18px;
      color: #fff;
      line-height: 30px;
    }
  }
}
</style>
