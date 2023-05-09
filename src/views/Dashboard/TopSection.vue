<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Dashboard
      </span>

      <div class="header-right">
        <!-- <b-button
          class="link-btn"
          :variant="voteType === 'VeCRV' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="$emit('changeVoteType', 'VeCRV')"

        >
          VeCRV
        </b-button>
        <b-button
          class="link-btn"
          :variant="voteType === 'VlCVX' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="$emit('changeVoteType', 'VlCVX')"
        >
          VlCVX
        </b-button> -->

        <CuSelect
          class="type-select"
          type="simple"
          :options="typeOptions"
          :value="voteType"
          @change="(val) => $emit('changeVoteType', val)"
        >

        </CuSelect>

        <CuSelect
          type="simple"
          class="cu-select"
          :options="marketOption"
          :value="market"
          @change="(val) => $emit('changeMarket', val)"
        />
      </div>
    </div>

  </b-container>
</template>
<!-- 对世界标准时间是：
这轮贿赂：3.16～3.22
下一轮贿赂：3.23～3.29
下下轮贿赂：3.30～4.5 -->
<script>
import { mapState } from 'vuex';
import moment from 'moment';
// import TopSummary from './TopSummary.vue';
// import BarChart from './BarChart.vue';
import CuSelect from '@/components/CuSelect';


export default {
  components: {

    CuSelect,
  },
  props: {
    selected: {
      type: Number,
    },
    changeVoteType: {
      type: Function,

    },
    voteType: {
      type: String,
    },
    market: {
      type: String,
    },

    // list: {
    //   type: Array,
    // },
  },
  data() {
    return {
      WEEK_SECONDS: 7 * 24 * 60 * 60,
      // voteType: 'VeCRV',
      // market: 'Lobby',

      typeOptions: [
        {
          label: 'VeCRV',
          value: 'VeCRV',
        },
        {
          label: 'VlCVX',
          value: 'VlCVX',
        },
      ],

      type: 'VeCRV',
    };
  },
  computed: {
    ...mapState(['user', 'marketOption']),

  },
  created() {
    // this.$emit('change', this.list[0]);
  },

  methods: {


  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.top-section {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  .header {
    height: 130px;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    padding-right: 10px;
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-right {
      display: flex;
      align-items: center;

      .link-btn {
        margin-left: 30px;
        width: 130px;
        height: 50px;
      }
    }
  }

  // .content {
  //   display: grid;
  //   grid-template-columns: 670px 530px;
  //   height: 317px;
  //   cursor: pointer;

  //   .left {
  //     display: grid;
  //     border-right: 1px solid $border-color;
  //     box-sizing: border-box;
  //     padding: 12px;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     & .title {
  //       margin-bottom: 24px;
  //       font-size: 30px;
  //     }
  //     & .desc {
  //       margin-bottom: 24px;
  //       font-size: 18px;
  //     }

  //     & .time {
  //       font-size: 18px;
  //       color: #CCCCCC;
  //       & em {
  //         color: #1DD186;
  //         font-style: normal;
  //       }
  //     }
  //     &.active {
  //       padding: 9px;
  //       border: 3px solid;
  //       border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
  //     }
  //   }

  //   .right {
  //     display: grid;
  //     grid-template-rows: 1fr 1fr;

  //     & .title {
  //       margin-bottom: 18px;
  //       font-size: 30px;
  //     }

  //     & .time {
  //       font-size: 18px;
  //       color: #CCCCCC;
  //       & em {
  //         color: #1DD186;
  //         font-style: normal;
  //       }
  //     }
  //   }

  //   .right-top {
  //     // border-bottom: 1px solid $border-color;
  //     box-sizing: border-box;
  //     padding: 8px;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     &.active {
  //       padding: 6px 5px;
  //       border: 3px solid;
  //       border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
  //     }
  //   }

  //   .right-bottom {
  //     padding: 8px;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     border-top: 1px solid $border-color;
  //      &.active {
  //       padding: 6px 5px 5px;
  //       border: 3px solid;
  //       border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
  //     }
  //   }
  // }
}
</style>
