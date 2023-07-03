<template>
  <div class="footer">
    <b-container fluid="lg">
      <b-row class="footer-bar" align-h="between" align-v="center">
        <b-col cols="12" lg="6">
          <img class="logo" src="@/assets/img/logo@2x.png" alt="">
        </b-col>

        <b-col cols="12" lg="6" class="social-wrapper">
          <!-- <img class="social-icon" src="@/assets/img/icon-reddit@2x.png" alt=""> -->
          <div class="social-icon-wrapper">
            <img class="social-icon" @click="linkTo('https://t.me/LobbyDAO_page')" src="@/assets/img/icon-telegram@2x.png" alt="">
          </div>
          <div class="social-icon-wrapper">
            <img class="social-icon" @click="linkTo('https://twitter.com/LobbyPage')" src="@/assets/img/icon-twitter@2x.png" alt="">
          </div>

          <div class="social-icon-wrapper">
            <img class="social-icon" @click="linkTo('https://lobbydao.gitbook.io/lobbydao-curve-bribery-aggregator/')" src="@/assets/img/icon-gitbook@2x.png" alt="">
          </div>
        </b-col>
      </b-row>
      <b-row class="copyright-bar" align-h="left" align-v="center">
        <b-col>
          <div class="copyright">Copyright © <em>Lobby</em> Corp. All Rights Reserved</div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['showComingSoon']),

    linkTo(link) {
      window.open(link);
    }
  },
};
</script>

<style lang="scss" scoped>

@import "@/styles/vars.scss";
.footer {
  border-top: 1px solid $border-color;
  padding-top: 40px;
}

.footer-bar {
  margin-bottom: 26px;
  .logo {
    height: 36px;
  }

  .social-wrapper {
    text-align: right;
  }

  .social-icon-wrapper {
    width: 36px;
    height: 36px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255,255, 0.08);
    border-radius: 50%;
    & + .social-icon-wrapper {
      margin-left: 40px;
    }
  }
  .social-icon {
    width: 24px;
    cursor: pointer;
  }

}
.copyright-bar  {
  margin-bottom: 58px;
  .copyright {
    color: #6B717B;
    font-size: 18px;
    & em {
      color: #18F195;
      font-style: normal;
    }
  }
}


</style>
