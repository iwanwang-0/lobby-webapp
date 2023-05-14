<template>
  <div class="page-container">
    <!-- <TopSection></TopSection> -->
    <VoteEditListSection
      :voteType="type"
    ></VoteEditListSection>
  </div>
</template>

<script>
// @ is an alias to /src
// import TopSection from '../Vote/TopSection.vue';
import VoteEditListSection from './VoteEditListSection.vue';

export default {
  name: 'Home',
  components: {
    VoteEditListSection,
    // TopSection,
  },

  data() {
    // const { type } = this.$route.params;
    return {
      type: 'VeCRV',
    }
  }
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
