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
          @click="$router.push('/dashboard')"
        >Launch APP</button>
      </div>

      <div class="right-content">
        <img src="~./assets/bg-sheep.png" alt="">
      </div>
    </div>

    <div class="social-group">
      <div @click="linkTo('https://t.me/LobbyDAO_page')">
        <div class="social-icon-wrapper">
          <img class="social-icon" src="@/assets/img/icon-telegram@2x.png" alt="">
        </div>
        Telegram
      </div>
      <div @click="linkTo('https://twitter.com/LobbyPage')">
        <div class="social-icon-wrapper">
          <img class="social-icon" src="@/assets/img/icon-twitter@2x.png" alt="">
        </div>
        Twitter
      </div>

      <div @click="linkTo('https://lobbydao.gitbook.io/lobbydao-curve-bribery-aggregator/')">
        <div class="social-icon-wrapper">
          <img class="social-icon" src="@/assets/img/icon-gitbook@2x.png" alt="">
        </div>
        Gitbook
      </div>
      <!-- <img class="social-btn" src="~./assets/discord.png" alt=""> -->
      <!-- <img class="social-btn" @click="linkTo('https://twitter.com/LobbyCRV')" src="~./assets/twitter.png" alt=""> -->
      <!-- <img class="social-btn" src="~./assets/medium.png" alt=""> -->
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
      this.$store.dispatch('unlock');
    },
    linkTo(link) {
      window.open(link);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.page-container {
  background: url(~./assets/bg.png) 50% 50% / cover no-repeat;
  width: 100vw;
  padding-left: 40px;
  padding-right: 40px;
  min-width: 1200px;
  height: 100vh;
  overflow: hidden;
  position: relative;

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
    padding-top: 20vh;
    color: #fff;
    z-index: 2;
    position: relative;

      .title {
        font-family: "ChillPixels Maximal";
        font-weight: 700;
        font-size: 80px;
        margin: 0;
      }
      .sub-title {
        // font-family: 'Inter';
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
    // & img {
    //   width: 40vw;
    // }
  }

  .social-btn {
    height: 32px;
    cursor: pointer;
    margin-right: 40px;
  }

  .social-group {
    position: absolute;
    bottom: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .social-icon-wrapper {
    width: 36px;
    height: 36px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255,255, 0.1);
    border-radius: 4px;
    margin-right: 8px;
    & + .social-icon-wrapper {
      margin-left: 40px;
    }
  }
  .social-icon {
    width: 32px;
  }
  // display: grid;
  // grid-template-columns: 700px 500px;
  // .left {
  //   border-right: 1px solid $border-color;
  // }
}
</style>
