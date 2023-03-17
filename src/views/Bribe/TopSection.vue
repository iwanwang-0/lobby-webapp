<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Current Bribe
      </span>
    </div>

    <div class="content">
      <div class="left">
          Bribe
      </div>
      <div class="right">
        <div class="right-top"></div>
        <div class="right-bottom"></div>
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
  grid-template-rows: 130px 317px;
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
    grid-template-columns: 670px 530px;
    height: 317px;
    .left {
      display: grid;
      border-right: 1px solid $border-color;
      border: 3px solid;
      border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
    }

    .right {
      display: grid;
      grid-template-rows: 157px 157px;
    }

    .right-top {
      border-bottom: 1px solid $border-color;
    }
  }
}
</style>
