<template>
  <div class="page-container">
    <HistoryListSection
      :voteType="voteType"
      :key="voteType"
    ></HistoryListSection>
    <RewardListSection
      :voteType="voteType"
      :key="voteType"
    ></RewardListSection>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import HistoryListSection from './HistoryListSection.vue';
import RewardListSection from './RewardListSection.vue';

export default {
  name: 'Home',
  components: {
    HistoryListSection,
    RewardListSection,
  },
  data() {
    return {
      voteType: 'VeCRV',
    };
  },

  computed: {
    ...mapState(['cvxChoices', 'proposal']),
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
</style>
