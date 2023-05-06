<template>
  <div class="page-container">
    <TopSection
      :voteType="voteType"
      @changeVoteType="changeVoteType"
    ></TopSection>

    <VoteListSection
      :voteType="voteType"
    ></VoteListSection>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import TopSection from './TopSection.vue';
import VoteListSection from './VoteListSection.vue';

export default {
  name: 'Home',
  components: {
    TopSection,
    VoteListSection,
  },
  data() {
    return {
      voteType: 'VeCRV',
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
