<template>
  <div class="page-container">
    <TopSection
      :voteType="voteType"
      :market="market"
      @changeVoteType="changeVoteType"
      @changeMarket="changeMarket"
    ></TopSection>
    <TopSummary
      :voteType="voteType"
      :round="round"
      :total="total"
      :price="price"
      @round-change="onRoundChange"
    />
    <BarChart
      :key="'BarChart' + round"
      :round="round"
      :market="market"
      :voteType="voteType"
      @total-change="totalChange"
      @price-change="priceChange"
    />
    <VoteListSection
      :key="'VoteListSection' + round"
      :round="round"
      :market="market"
      :voteType="voteType"
    ></VoteListSection>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import TopSection from './TopSection.vue';
import VoteListSection from './VoteListSection.vue';
import TopSummary from './TopSummary.vue';
import BarChart from './BarChart.vue';

export default {
  name: 'Home',
  components: {
    TopSection,
    TopSummary,
    BarChart,
    VoteListSection,
  },
  data() {
    return {
      voteType: 'VeCRV',
      round: 0,
      market: 'All',

      total: 0,
      price: 0,
    };
  },

  computed: {
    ...mapState(['cvxChoices', 'proposal']),
  },

  created(){
    // this.getList();
  },

  methods: {
    changeVoteType(type) {
      // console.log(type)
      this.voteType = type;
    },

    onRoundChange(round) {
      console.log(round)
      this.round = round;
    },
    changeMarket(market) {
      this.market = market;
    },

    totalChange(total) {
      this.total = total
    },
    priceChange(price) {
      this.price = price;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.page-container {

  // display: grid;
  // grid-template-columns: 700px 500px;
  // .left {
  //   border-right: 1px solid $border-color;
  // }
}
</style>
