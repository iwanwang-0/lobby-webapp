<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

  computed: {
    ...mapState({
      // user:
    }),
  },
  mounted() {
    console.log('get prop')
    this.$store.dispatch('getProposal');
    this.$store.dispatch('getGauges');
  },
};
</script>
