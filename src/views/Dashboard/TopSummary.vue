<template>
    <div class="content">
      <div>
        <div class="value">35</div>
        <div class="label">Round Number</div>
      </div>
      <div>
        <div class="value">$0.03932</div>
        <div class="label">$/veCRV</div>
      </div>
      <div>
        <div class="value">2023/1/10</div>
        <div class="label">Deadline</div>
      </div>
      <div>
        <div class="value">$1.74m</div>
        <div class="label">Total</div>
      </div>
    </div>
</template>
<script>

export default {
  components: {
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
  height: 130px;
  .content {
    // border-bottom: 1px dashed $border-color;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid $border-color;

    // height: 317px;
    & > div {
      border-left: 1px dashed $border-color;
      padding-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    & > div:first-child {
      border-left: 0
    }

    & .value {
      font-size: 36px;
      font-weight: normal;
      font-family: ChillPixels Maximal;
      color: #64D98A;
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
