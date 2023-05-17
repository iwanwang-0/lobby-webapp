<template>
  <div class="page-container">
    <TopSection
      :selected="selected && selected.idx"
      @change="val => selected = val"
      :voteType="voteType"
      @changeVoteType="changeVoteType"
    ></TopSection>
    <FormSection
      :selected-round="selected"
      :voteType="voteType"
      @bribeSuccess="bribeIdx += 1"
    ></FormSection>
    <ListSection
      :voteType="voteType"
      :key="bribeIdx"
    ></ListSection>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
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
      selected: null,
      voteType: 'VeCRV',
      bribeIdx: 0,
    };
  },
  computed: {
    ...mapState(['user']),
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
