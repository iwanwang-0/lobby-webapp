<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Bribe history
      </span>
    </div>

    <div class="content">
      <TableList
        :cols="cols"
        :list="data"
      />
    </div>
  </b-container>
</template>

<script>
import TableList from '@/components/TableList';

export default {
  components: {
    TableList,
  },

  data() {
    return {
      cols: [
        {
          title: 'Round',
          prop: 'round',
        },
        {
          title: 'Pool',
          prop: 'pool',
        },
        {
          title: 'Token',
          prop: 'token',
        },
        {
          title: 'Quantity',
          prop: 'quantity',
        },
        {
          title: 'Time',
          prop: 'time',
        },
      ],
      data: [
        {
          round: '1',
          pool: 'ETH-alETH',
          token: 'ETH',
          quantity: '100',
          time: '2022/02/22',
        },
        {
          round: '2',
          pool: 'ETH-alETH',
          token: 'ETH',
          quantity: '100',
          time: '2022/02/22',
        },
      ]
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.top-section {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
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
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}
</style>
