<template>
  <div class="page-container">
    <nav class="top-nav">
      <img class="logo" src="~@/assets/img/logo@2x.png" alt="">
      <span
        v-if="user.address"
        class="address-btn"
      >
        {{user.address | ellipsis}}
      </span>
      <button class="button"
        v-else

        @click="unlock"
        >Connect Wallet</button>
    </nav>

    <div class="content">
      <div class="left-content">
        <p class="title">ALL-IN-ONE</p>
        <p class="sub-title">curve voting aggregator</p>
        <button
          class="button launch-btn"
          @click="$router.push('/home')"
        >Launch APP</button>
      </div>

      <div class="right-content">
        <img src="~./assets/bg-sheep.png" alt="">
      </div>
    </div>

    <div class="social-group">
      <img class="social-btn" src="~./assets/discord.png" alt="">
      <img class="social-btn" src="~./assets/twitter.png" alt="">
      <img class="social-btn" src="~./assets/medium.png" alt="">
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';

export default {
  name: 'Index',
  components: {
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    unlock() {
      this.$store.dispatch('unlockByMetaMask');
    },

  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.page-container {
  background: url(~./assets/bg.png) 50% 50% / cover no-repeat;
  width: 100vw;
  height: 100vh;
  padding-left: 40px;
  padding-right: 40px;
  min-width: 1200px;

  .top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 0;
  }
  .logo {
    height: 40px;
  }
  .button {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 10px 20px;
    gap: 10px;

    // width: 136px;

    // height: 39px;
    left: calc(50% - 136px/2 - 699px);
    top: 557px;

    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border: 0;
    border-radius: 8px;
  }

  .left-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-top: 250px;
    color: #fff;

      .title {
        font-family: "ChillPixels Maximal";
        font-weight: 700;
        font-size: 80px;
        margin: 0;
      }
      .sub-title {
        font-family: 'Inter';
        font-weight: 400;
        font-size: 50px;
        line-height: 61px;
        margin: 0;
    }

    .launch-btn {
      margin-top: 40px;
    }
  }

  .right-content {
    position: absolute;
    top: 0%;
    right: 15%;
  }

  .social-btn {
    height: 32px;
    cursor: pointer;
    margin-right: 40px;
  }

  .social-group {
    position: absolute;
    bottom: 48px;
  }
  // display: grid;
  // grid-template-columns: 700px 500px;
  // .left {
  //   border-right: 1px solid $border-color;
  // }
}
</style>
