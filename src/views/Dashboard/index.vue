<template>
  <div class="page-container">
    <TopSection
      :voteType="voteType"
      @changeVoteType="changeVoteType"
    ></TopSection>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import TopSection from './TopSection.vue';

export default {
  name: 'Home',
  components: {
    TopSection,
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
      console.log(type)
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
