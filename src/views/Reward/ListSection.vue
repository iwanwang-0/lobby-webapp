<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Details
      </span>

      <div class="header-right">

        <b-button
          class="link-btn"
          variant="link"
          style="color: #fff;  box-shadow: none;"
        >
          Forward rewards
        </b-button>
        <b-button
          class="link-btn"
          variant="link"
        >
          Claim all <img style="width: 18px;" src="~@/assets/img/right-arrow@2x.png" alt="">
        </b-button>

        <RoundSelect
          :options="roundOptions"
          v-model="round"
        />
      </div>
    </div>

    <div class="content">
      <TableList
        :cols="cols"
        :list="data"
      >
        <template v-slot:operation="{ row }">
          <!-- {{ row }} -->
          <b-button
            variant="link"
          >
            Claim <img style="width: 18px;" src="~@/assets/img/right-arrow@2x.png" alt="">
          </b-button>
        </template>
      </TableList>
    </div>
  </b-container>
</template>

<script>
import TableList from '@/components/TableList';
import RoundSelect from '@/components/RoundSelect';

export default {
  components: {
    TableList,
    RoundSelect,
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
          title: 'Contract',
          prop: 'contract',
        },
        {
          title: 'Rewards',
          prop: 'rewards',
        },
        {
          title: 'Operation',
          prop: 'operation',
        },
      ],
      data: [
        // {
        //   round: '1',
        //   pool: 'ETH-alETH',
        //   contract: '0xa76…Eg6FG',
        //   rewards: '158.87 $CRV',
        //   operation: '',
        // },
        // {
        //   round: '2',
        //   pool: 'ETH-alETH',
        //   contract: '0xa76…Eg6FG',
        //   rewards: '158.87 $CRV',
        //   operation: '',
        // },
      ],
      round: 1,
      roundOptions: [
        {
          label: 1,
          value: 1,
        }, {
          label: 2,
          value: 2,
        }, {
          label: 3,
          value: 3,
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
  display: grid;
  grid-template-rows: 130px auto;
  .header {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .link-btn {
      font-size: 18px;
      margin-right: 24px;
      font-family: ChillPixels Mono;
    }
  }
  .content {
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}
</style>
