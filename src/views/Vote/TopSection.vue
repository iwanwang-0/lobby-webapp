<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Current Votes
      </span>
      <div class="header-right">
        <b-button
          class="link-btn"
          :variant="voteType === 'VeCRV' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="changeVoteType('VeCRV')"

        >
          VeCRV
        </b-button>
        <b-button
          class="link-btn"
          :variant="voteType === 'VlCVX' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="changeVoteType('VlCVX')"
        >
          VlCVX
        </b-button>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="row1">{{desc}}</div>

        <!-- <div class="row2">Time Remaining to Vote:
          <span class="remain-text">
            <template v-if="this.voteType === 'VeCRV'">
              <em>{{currentDurEnd.date}}</em>d
              <em>{{currentDurEnd.hour}}</em>h
              <em>{{currentDurEnd.minute}}</em>min
              <em>{{currentDurEnd.second}}</em>s
            </template>

            <template v-if="voteType === 'VlCRV' && proposal.end">
              <em>{{cvxCurrentDurEnd.date}}</em>d
              <em>{{cvxCurrentDurEnd.hour}}</em>h
              <em>{{cvxCurrentDurEnd.minute}}</em>min
              <em>{{cvxCurrentDurEnd.second}}</em>s
            </template>
          </span>
        </div> -->

        <template v-if="this.voteType === 'VeCRV'">
          <div class="row2">Time Remaining to Vote:
            <span class="remain-text">
                <em>{{currentDurEnd.date}}</em>d
                <em>{{currentDurEnd.hour}}</em>h
                <em>{{currentDurEnd.minute}}</em>min
                <em>{{currentDurEnd.second}}</em>s
            </span>
          </div>
        </template>

        <template v-if="voteType === 'VlCVX' && proposal.end">
          <div class="row2">Time Remaining to Vote:
            <span class="remain-text">
                <em>{{cvxCurrentDurEnd.date}}</em>d
                <em>{{cvxCurrentDurEnd.hour}}</em>h
                <em>{{cvxCurrentDurEnd.minute}}</em>min
                <em>{{cvxCurrentDurEnd.second}}</em>s
            </span>
          </div>
        </template>
        <template v-if="voteType === 'VlCVX' && !proposal.end">
          <div class="row2">No vlCVX votes this week...</div>
        </template>

        <div class="row3">
          Remaining time until the next round of voting：
          <template v-if="this.voteType === 'VeCRV'">
              <em>{{currentDurEnd.date}}</em>d
              <em>{{currentDurEnd.hour}}</em>h
              <em>{{currentDurEnd.minute}}</em>min
              <em>{{currentDurEnd.second}}</em>s
            </template>
            <template v-else>
              <em>{{cvxNextDurStart.date}}</em>d
              <em>{{cvxNextDurStart.hour}}</em>h
              <em>{{cvxNextDurStart.minute}}</em>min
              <em>{{cvxNextDurStart.second}}</em>s
            </template>
        </div>
        <!-- <div class="title">Reward</div>
        <div class="desc">Each round of Reward will be distributed <em>48h</em> after the end of voting</div> -->
      </div>
      <div class="right">
        <template v-if="voteType === 'VeCRV'">
          <div>Your veCRV Voting Power:
           <span class="power-text">
              <em>
              {{crvBalance}}
              </em>
          </span>
        </div>
        </template>
        <template v-if="voteType === 'VlCVX'">
          <div>Your {{ proposal.end ? 'Voting Power' : 'vlCVX' }}:
            <span class="power-text">
                <em>
                {{cvxBalance}}
                </em>
            </span>
          </div>
        </template>

        <div>Your reward will be distributed <em>48h</em> after the voting</div>
        <!-- <div class="right-row">Claimable reward: <em>$123,456</em></div>
        <div class="right-row">Rewards received: <em>$123,456</em></div>
        <div class="right-row">Total Claimable Rewards: <em>$123,456</em></div>
        <div class="right-row">Total rewards received: <em>$123,456</em></div> -->
      </div>
    </div>
  </b-container>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import config from '@/config';
import {
  getERC20Contract, getERC20Interface, provider,
  getProdERC20Contract,
} from '@/eth/ethereum';
import toFixed from '@/filters/toFixed';
import { CVX_START_SECONDS, WEEK_SECONDS } from '@/constants/time';

export default {
  props: {
    voteType: {
      type: String,
    },
  },
  data() {
    return {
      now: Date.now(),
      current: moment(),
      cvxCurrent: moment(),
      cvxCurrentEnd: moment(),

      crvBalance: 0,
      cvxBalance: 0,
      // crvRound: this.getCurrentCvxRound(),
      // cvxRound: this.getCurrentCvxRound(),
    };
  },

  computed: {
    ...mapState(['user', 'cvxChoices', 'proposal', 'crvChoices']),
    currentDurEnd() {
      return this.getRemainTime(this.current);
    },
    cvxCurrentDurEnd() {
      return this.getRemainTime(this.cvxCurrentEnd);
    },

    cvxNextDurStart() {
      return this.getRemainTime(this.cvxCurrent);
    },
    desc() {
      return `The ${this.voteType === 'VeCRV' ? 'veCRV' : 'vlCVX'} Gauge voting award for the week of
      ${ (this.voteType === 'VeCRV' ? this.current : this.cvxCurrent).local().format('MMMM Do HH:mm a')}
      GMT ${(this.voteType === 'VeCRV' ? this.current : this.cvxCurrent).local().format('ZZ')}`;
    },
  },

  watch: {
    proposal() {
      this.setTime();
    },
    user: {
      handler() {
        if (this.user.address) {
          this.getCrvBalance();
          this.getCvxBalance();
        }
      },
      immediate: true,
    },
  },

  created() {
    this.setTime();
    this.loopSetNow();
  },

  methods: {
    async getCrvBalance() {
      const balance = await getProdERC20Contract(config.VeCRV).balanceOf(this.user.address);
      this.crvBalance = toFixed(balance / 1e18, 2);
    },

    async getCvxBalance() {
      if (this.proposal.snapshot) {
        // const balance = await provider.getBalance(this.user.address, +this.proposal.snapshot);
        const balance = await getERC20Contract(config.VlCVX).balanceOf(this.user.address, {
          blockTag: +this.proposal.snapshot,
        });
        this.cvxBalance = toFixed(balance / 1e18, 2);
      } else {
        const balance = await getERC20Contract(config.VlCVX).balanceOf(this.user.address);
        this.cvxBalance = toFixed(balance / 1e18, 2);
      }
    },

    changeVoteType(type) {
      this.$emit('changeType', type);
    },

    getCurrentCvxRound() {
      let currentRoundStart = CVX_START_SECONDS;
      while (currentRoundStart < this.now / 1000) {
        currentRoundStart += WEEK_SECONDS * 2;
      }
      return currentRoundStart;
    },

    setTime() {
      const today = moment.utc();
      const thursday = moment.utc().day(4).startOf('day');

      if (today.isBefore(thursday)) {
        this.current = thursday.clone();
      } else {
        this.current = thursday.clone().add(7, 'day');
        this.next = thursday.clone().add(14, 'day');
        this.nextNext = thursday.clone().add(21, 'day');
      }

      const cvxThursday = moment(this.getCurrentCvxRound() * 1000);

      // console.log(moment(cvxThursday).format('YYYY-MM-DD dd HH:mm:ss Z'));
      // console.log(moment((CVX_START_SECONDS) * 1000).format('YYYY-MM-DD dd HH:mm:ss Z'));

      if (today.isBefore(cvxThursday)) {
        this.cvxCurrent = cvxThursday.clone();
        this.cvxCurrentEnd = cvxThursday.clone().subtract(2, 'day');
      } else {
        this.cvxCurrent = thursday.clone().add(14, 'day');
        this.cvxCurrentEnd = thursday.clone().add(14, 'day').subtract(2, 'day');
      }
    },

    getRemainTime(targetTime) {
      // console.log(targetTime)
      const duration = targetTime.diff(this.now, 'seconds');
      const second = duration % 60;
      const minute = Math.floor(duration / 60) % 60;
      const hour = Math.floor(duration / 60 / 60) % 24;
      const date = Math.floor(duration / 60 / 60 / 24);
      return {
        second,
        minute,
        hour,
        date,
      };
    },

    loopSetNow() {
      setTimeout(() => {
        this.now = Date.now();
        this.loopSetNow();
      }, 1000);
    },
  },
};

</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.top-section {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  grid-template-rows: 130px 180px;
  display: grid;
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
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
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
  grid-template-columns: 670px 530px;

  .left {
    display: flex;
    border-right: 1px dashed $border-color;
    justify-content: center;
    flex-direction: column;
    padding-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
    .row1 {
      font-size: 18px;
      color: #FFFFFF;
      margin-bottom: 10px;
    }

    .row2 {
      font-size: 18px;
      .remain-text {
        font-size: 30px;
      }
    }

    .row3 {
      font-size: 18px;
      .remain-text {
        font-size: 30px;
      }
    }

    em {
      color: #1DD186;
      font-style: normal;
    }

  }

  .right {
    display: grid;
    color: #CCCCCC;
    font-size: 18px;
    font-family: ChillPixels Mono;
    font-weight: normal;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;

    .power-text {
      font-size: 30px;
    }
    // .right-row {
    //   // width: 314px;
    //   // height: 18px;

    //   color: #CCCCCC;
    //   line-height: 18px;

    //   & + .right-row {
    //     border-top: 1px dashed $border-color;
    //   }
    // }

    em {
      color: #1DD186;
      font-style: normal;
    }
  }
}
</style>
