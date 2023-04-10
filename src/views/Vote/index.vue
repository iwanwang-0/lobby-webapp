<template>
  <div class="page-container">
    <TopSection
      :voteType="voteType"
      @changeType="changeVoteType"
    ></TopSection>
    <DelegateSection
      v-if="voteType !== 'VeCRV'"

    ></DelegateSection>
    <VoteListSection
    :voteType="voteType"
    ></VoteListSection>
    <HistoryListSection
      v-if="proposal.id"
      :voteType="voteType"
      :key="voteType"
    ></HistoryListSection>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import TopSection from './TopSection.vue';
import DelegateSection from './DelegateSection.vue';
import VoteListSection from './VoteListSection.vue';
import HistoryListSection from './HistoryListSection.vue';

export default {
  name: 'Home',
  components: {
    VoteListSection,
    TopSection,
    DelegateSection,
    HistoryListSection,
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
