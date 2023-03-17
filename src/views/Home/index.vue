<template>
  <div class="page-container">
    <TopSection></TopSection>
    <FaqSection></FaqSection>
  </div>
</template>

<script>
// @ is an alias to /src
import TopSection from './TopSection.vue';
import FaqSection from './FaqSection.vue';

export default {
  name: 'Home',
  components: {
    TopSection,
    FaqSection,
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
