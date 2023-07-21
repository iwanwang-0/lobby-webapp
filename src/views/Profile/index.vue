<template>
  <div class="page-container">
    <TokenStatusSection></TokenStatusSection>

    <!-- <template v-if="$route.params.tokenOwner === undefined"> -->
    <HistoryListSection :voteType="voteType" :key="voteType + 'history'"></HistoryListSection>
    <RewardListSection :voteType="voteType" :key="voteType + 'reward'"></RewardListSection>
    <!-- </template> -->
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import HistoryListSection from "./HistoryListSection.vue";
import RewardListSection from "./RewardListSection.vue";
import TokenStatusSection from "./TokenStatusSection.vue";

export default {
  name: "Home",
  components: {
    HistoryListSection,
    RewardListSection,
    TokenStatusSection,
  },
  data() {
    return {
      voteType: "VeCRV",
    };
  },
  created() {
    console.log(this.$route.params.tokenOwner);
  },

  computed: {
    ...mapState(["cvxChoices", "proposal"]),
  },

  methods: {
    changeVoteType(type) {
      this.voteType = type;
    },
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
.empty-content {
  text-align: center;
  // font-size: 0;
  margin: 128px;
}

.empty-text {
  margin-top: 16px;
  color: #cccccc;
  margin-left: 24px;
}
</style>
