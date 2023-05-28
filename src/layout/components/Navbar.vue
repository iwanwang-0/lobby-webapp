<template>
  <b-navbar
    class="navbar"
  >

    <b-container fluid="lg">
      <b-navbar-brand href="/">
        <img class="logo" src="@/assets/img/logo@2x.png" alt="">
      </b-navbar-brand>

      <div class="divider divider-left"></div>
      <b-navbar-toggle
        @click="onToggleClick"
        target="nav-collapse"
      ></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="main-nav">
          <b-nav-item :active="$route.path === '/'" @click="$router.push('/')">Home</b-nav-item>
          <b-nav-item :active="$route.path.startsWith('/vote')" @click="$router.push('/vote')">Vote</b-nav-item>
          <!-- <b-nav-item :active="$route.path.startsWith('/bribe')" @click="$router.push('/bribe')">Bribe</b-nav-item> -->
          <!-- <b-nav-item :active="$route.path.startsWith('/lob')" @click="$router.push('/lob')">Earn</b-nav-item> -->
          <b-nav-item :active="$route.path.startsWith('/dashboard')" @click="$router.push('/dashboard')">Dashboard</b-nav-item>
        </b-navbar-nav>

      <div class="divider divider-middle"></div>
        <!-- Right aligned nav items -->
        <b-navbar-nav >
          <!-- <b-button variant="link"  class="history-btn"  @click.stop.prevent="$emit('history')">History</b-button> -->
          <!-- <b-button class="lang-switch" variant="link">English</b-button> -->
          <b-button
            v-if="user.address"
            class="reward-btn"
            size="sm"
            variant="link"
            @click="$router.push('/reward')"
          >
            Reward
          </b-button>
          <span
              v-if="user.address"
              class="address-btn"
            >
              {{user.address | ellipsis}}
            </span>
           <b-button
              v-else
              size="sm"
              class="sign-btn"
              variant="link"
              @click="unlock"
            >
            Connect Wallet</b-button>
        </b-navbar-nav>

        <div class="divider divider-right"></div>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { setLang, getLang } from '@/common/lang';

export default {
  filters: {
    ellipsis(address) {
      return address.replace(/^(.{6}).*(.{6})$/, '$1...$2');
    },
  },
  data() {
    return {
      lang: getLang(),
      atTop: true,
      expand: false,

      active: 'Home',

    };
  },
  computed: {
    ...mapState(['user']),
    isHome() {
      return this.$route.path === '/';
    },
    langText() {
      const langMap = {
        zh: '简体中文',
        en: 'English',
      };
      return langMap[this.lang];
    },
  },
  mounted() {
  },

  methods: {
    onToggleClick() {
      this.expand = !this.expand;
    },
    changeLang(lang) {
      setLang(lang);
      window.location.reload();
    },

    ...mapActions(['showComingSoon']),

    unlock() {
      this.$store.dispatch('unlockByMetaMask');
    },

  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.logo {
  margin-right: 40px;
  height: 37px
}

.divider {
  height: 30px;
  border-right: 1px solid #ccc;
}

.navbar {
  border-bottom: 1px solid $border-color;
}
.main-nav {
  margin-left: 40px;

  & .nav-item {
    // margin-right: 50px;
    margin-right: 36px;
    font-size: 18px;
    line-height: 14px;
    .nav-link {
      color: #CCCCCC;
      font-size: 18px;
      padding: 0 0;
      display: inline-block;
      &:focus {
        color: #CCCCCC;
      }
      &:hover {
        color: darken(#CCCCCC, 20);
      }
      &.active {
        color: #1DD186;
      }
    }
  }
}

.navbar-nav {
  .address-btn {
    margin-right: 12px;
    // border: 2px solid #FFB600;
    // border-radius: 16px;
    // color: #FFB600;
    height: 32px;
    padding: 0 12px;
    line-height: 32px;
    // background: rgba(255, 255, 255, 0.3);
  }
}

.navbar-collapse {
  justify-content: space-between;
}

.sign-btn{
  height: 40px;
  font-weight: bold;
  margin-left: 46px;
  margin-right: 46px;
  font-size: 18px;
  letter-spacing: 1px;
  // width: 100%
}

.reward-btn {
  height: 32px;
  padding: 0;
  font-size: 18px;
  margin-right: 30px;
}

</style>
