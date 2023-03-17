<template>
   <b-container class="home" fluid="lg">
    <div class="left">
      Faq
    </div>
    <div class="right">
    </div>
  </b-container>
</template>

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

  }

  .right {
    display: grid;
  }
}
</style>
