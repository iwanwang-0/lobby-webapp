<template>
  <b-container class="top-section" fluid="lg">
    <div class="content">
      <div class="token-row">
        <div class="power-text"><em> crv</em></div>
        <div>{{ crv }}</div>
      </div>
      <div class="token-row">
        <div class="power-text"><em> cvx</em></div>
        <div>{{ cvx }}</div>
      </div>
      <div class="token-row">
        <div class="power-text"><em> vecrv</em></div>
        <div>{{ vecrv }}</div>
      </div>
      <div class="token-row">
        <div class="power-text"><em> vlcvx</em></div>
        <div>{{ vlcvx }}</div>
      </div>
    </div>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import { getTokenBalance } from "../../api/common";

export default {
  components: {},

  props: {},

  data() {
    return {
      crv: 0,
      cvx: 0,
      vecrv: 0,
      vlcvx: 0,
    };
  },

  computed: {
    currentAddress() {
      return this.$route.params.tokenOwner;
    },
    ...mapState({
      user: (state) => state.user,
    }),
  },

  watch: {
    currentAddress: {
      handler() {
        this.crv = 0;
        this.cvx = 0;
        this.vecrv = 0;
        this.vlcvx = 0;
        this.fetchTokenBalance();
      },
    },
  },

  created() {
    this.fetchTokenBalance();
  },

  methods: {
    async fetchTokenBalance() {
      try {
        const res = await getTokenBalance({
          owner: this.$route.params.tokenOwner || this.user.address,
        });

        res.data.forEach((t) => {
          if (Number(t.amount) > 0) {
            this[t.token] = Number(t.amount).toFixed(2);
          } else this[t.token] = Number(t.amount);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.top-section {
  border: 1px solid $border-color;
  // border-left: 1px solid $border-color;
  // border-right: 1px solid $border-color;
  // border-bottom: 1px solid $border-color;
}

.header {
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "ChillPixels Maximal";
  font-size: 48px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  .header-text {
    background: linear-gradient(218deg, #ff460e 0%, #eca13f 44%, #00dd59 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-right {
    display: flex;
    align-items: center;

    .link-btn {
      margin-left: 30px;
      width: 130px;
      height: 50px;
    }
  }

  // .header-right {
  //   display: flex;
  //   align-items: center;
  // }

  // .link-btn {
  //   font-size: 18px;
  //   margin-right: 24px;
  //   font-family: ChillPixels Mono;
  // }
}
.content {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;

  .token-row {
    padding: 16px;
    color: #cccccc;
    font-size: 18px;
    font-family: ChillPixels Mono;
    font-weight: normal;
    border-right: 1px solid $border-color;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .power-text {
      font-size: 30px;
    }
    em {
      color: #1dd186;
      font-style: normal;
    }
  }
  // .left {
  //   display: flex;
  //   border-right: 1px dashed $border-color;
  //   justify-content: center;
  //   flex-direction: column;
  //   padding-left: 10px;
  //   padding-left: 10px;
  //   padding-right: 10px;
  //   .row1 {
  //     font-size: 18px;
  //     color: #ffffff;
  //     margin-bottom: 10px;
  //   }

  //   .row2 {
  //     font-size: 18px;
  //     .remain-text {
  //       font-size: 30px;
  //     }
  //   }

  //   .row3 {
  //     font-size: 18px;
  //     .remain-text {
  //       font-size: 30px;
  //     }
  //   }

  //   em {
  //     color: #1dd186;
  //     font-style: normal;
  //   }
  // }

  // .right {
  //   display: grid;
  //   color: #cccccc;
  //   font-size: 18px;
  //   font-family: ChillPixels Mono;
  //   font-weight: normal;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   padding-left: 10px;
  //   padding-right: 10px;

  //   .power-text {
  //     font-size: 30px;
  //   }
  //   // .right-row {
  //   //   // width: 314px;
  //   //   // height: 18px;

  //   //   color: #CCCCCC;
  //   //   line-height: 18px;

  //   //   & + .right-row {
  //   //     border-top: 1px dashed $border-color;
  //   //   }
  //   // }

  //   em {
  //     color: #1dd186;
  //     font-style: normal;
  //   }
  // }
}
</style>
