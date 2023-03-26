<template>
  <div
    class="app-wrapper">
      <!-- <div class="fixed-header"> -->
        <navbar
          @history="openHistory"
        />
      <!-- </div> -->

      <b-modal size="lg" ref="my-modal" modal-class="history-modal" hide-footer title="History">
        <div class="invite-card">
        </div>
      </b-modal>

        <router-view v-if="user.loaded"/>
      <footerbar />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from './components/Navbar.vue';
import Footerbar from './components/Footerbar.vue';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Footerbar,
  },
  data() {
    return {
      active: 1,
      list: [
        {
          type: '222',
          claimable: '1',
        },
        {
          type: '222',
          claimable: '1',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  // async created() {
  //   if (window.ethereum) {

  //   }
  // },
  methods: {
    openHistory() {
      this.$refs['my-modal'].show();
    },

    changeInviteCard(id) {
      this.active = id;
    },
  },
};
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
  // @import "~@/styles/mixin.scss";
  // @import "~@/styles/variable.scss";

  .fixed-header {
    height: 74px;
  }

  @media (max-width: 992px) {

  }
</style>
