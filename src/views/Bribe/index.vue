<template>
  <div class="page-container">
    <TopSection
      :selected="selected"
      :list="currentList"
      @change="val => selected = val"
    ></TopSection>
    <FormSection></FormSection>
    <ListSection></ListSection>
  </div>
</template>

<script>
// @ is an alias to /src
import TopSection from './TopSection.vue';
import ListSection from './ListSection.vue';
import FormSection from './FormSection.vue';

export default {
  name: 'Home',
  components: {
    TopSection,
    FormSection,
    ListSection,
  },

  data() {
    return {
      selected: 1,
      currentList: [
        {
          title: 'Current Bribe (February 9)',
          desc: 'The veCRV Gauge voting award for the week of February 9, 8:00 am GMT+8',
          time: Date.now(),
          // time: 'Time Remaining to Vote: <em>03</em>d <em>13</em>h <em>20</em>min <em>36</em>',
        },
        {
          title: 'Current Bribe (February 9)',
          desc: 'The veCRV Gauge voting award for the week of February 9, 8:00 am GMT+8',
          time: Date.now(),
        },
        {
          title: 'Current Bribe (February 9)',
          desc: 'The veCRV Gauge voting award for the week of February 9, 8:00 am GMT+8',
          time: Date.now(),

        }
      ]
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
