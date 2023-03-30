<template>
  <div class="page-container">
    <TopSection></TopSection>
    <LockingSection></LockingSection>
    <StakingSection></StakingSection>
    <VotingSection></VotingSection>
  </div>
</template>

<script>
// @ is an alias to /src
import TopSection from './TopSection.vue';
import LockingSection from './LockingSection.vue';
import StakingSection from './StakingSection.vue';
import VotingSection from './VotingSection.vue';

export default {
  name: 'Home',
  components: {
    TopSection,
    LockingSection,
    StakingSection,
    VotingSection,
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
