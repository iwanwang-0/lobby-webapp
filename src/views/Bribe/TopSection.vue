<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Current Bribe
      </span>

      <div class="header-right">
        <b-button
          class="link-btn"
          :variant="voteType === 'VeCRV' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="onTypeChange('VeCRV')"

        >
          VeCRV
        </b-button>
        <b-button
          class="link-btn"
          :variant="voteType === 'VlCVX' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="onTypeChange('VlCVX')"
        >
          VlCVX
        </b-button>
      </div>
    </div>

    <div class="content">
      <div class="left"
        :class="{active: selected === 0}"
        v-if="list && list[0]"
        @click="onClick(list[0])"
      >
        <h5 class="title">{{ list[0].title }}</h5>
        <div class="desc">{{ list[0].desc }}</div>
        <div class="time">Time Remaining to Vote:
          <template v-if="this.voteType === 'VeCRV'">
            <em>{{currentDur.date}}</em>d
            <em>{{currentDur.hour}}</em>h
            <em>{{currentDur.minute}}</em>min
            <em>{{currentDur.second}}</em>s
          </template>
          <template v-else>
            <em>{{cvxCurrentDur.date}}</em>d
            <em>{{cvxCurrentDur.hour}}</em>h
            <em>{{cvxCurrentDur.minute}}</em>min
            <em>{{cvxCurrentDur.second}}</em>s
          </template>
        </div>
      </div>
      <div class="right">
        <div class="right-top" :class="{active: selected === 1, vlcvx: voteType === 'VlCVX'}"  v-if="list && list[1]"
        @click="onClick(list[1])"
        >
          <h5 class="title">{{ list[1].title }}</h5>
          <div class="time">Bribe deadline:
            <template v-if="this.voteType === 'VeCRV'">
              <em>{{nextDur.date}}</em>d
              <em>{{nextDur.hour}}</em>h
              <em>{{nextDur.minute}}</em>min
              <em>{{nextDur.second}}</em>s
          </template>
          <template v-else>
            <em>{{cvxNextDur.date}}</em>d
            <em>{{cvxNextDur.hour}}</em>h
            <em>{{cvxNextDur.minute}}</em>min
            <em>{{cvxNextDur.second}}</em>s
          </template>
          </div>
        </div>
        <div class="right-bottom" :class="{active: selected === 2,  vlcvx: voteType === 'VlCVX'}"  v-if="list && list[2]"
        @click="onClick(list[2])"
        >
          <h5 class="title">{{ list[2].title }}</h5>
          <div class="time">Bribe deadline:
            <template v-if="this.voteType === 'VeCRV'">
              <em>{{nextNextDur.date}}</em>d
              <em>{{nextNextDur.hour}}</em>h
              <em>{{nextNextDur.minute}}</em>min
              <em>{{nextNextDur.second}}</em>s
            </template>
            <template v-else>
              <em>{{cvxNextNextDur.date}}</em>d
              <em>{{cvxNextNextDur.hour}}</em>h
              <em>{{cvxNextNextDur.minute}}</em>min
              <em>{{cvxNextNextDur.second}}</em>s
            </template>

          </div>
        </div>
      </div>
    </div>
  </b-container>
</template>
<!-- 对世界标准时间是：
这轮贿赂：3.16～3.22
下一轮贿赂：3.23～3.29
下下轮贿赂：3.30～4.5 -->
<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  props: {
    selected: {
      type: Number,
    },
    changeVoteType: {
      type: Function,

    },
    voteType: {
      type: String,
    },
  },
  data() {
    return {
      now: Date.now(),
      current: moment(),
      next: moment(),
      nextNext: moment(),

      cvxCurrent: moment(),
      cvxNext: moment(),
      cvxNextNext: moment(),
    };
  },
  computed: {
    ...mapState(['cvxChoices', 'proposal', 'crvChoices']),
    list() {
      return [
        {
          idx: 0,
          title: `Current Bribe (${this.voteType === 'VeCRV' ? this.current.format('MMMM D') : this.cvxCurrent.format('MMMM D')})`,
          desc: `The ${this.voteType === 'VeCRV' ? 'veCRV' : 'vlCVX'} Gauge voting award for the week of ${this.voteType === 'VeCRV' ? this.current.local().format('MMMM D HH:mm a') : this.cvxCurrent.local().format('MMMM D HH:mm a')} GMT${this.current.local().format('ZZ')}`,
          time: this.current,
        },
        {
          idx: 1,
          title: `Next round of Bribe (${this.voteType === 'VeCRV' ? this.next.format('MMMM D') : this.cvxNext.format('MMMM D')})`,
          time: this.next,
        },
        {
          idx: 2,
          title: `The third round of Bribe (${this.voteType === 'VeCRV' ? this.nextNext.format('MMMM D') : this.cvxNextNext.format('MMMM D')})`,
          time: this.nextNext,
        },
      ]
    },
    currentDur() {
      return this.getRemainTime(this.current);
    },
    nextDur() {
      return this.getRemainTime(this.next);
    },
    nextNextDur() {
      return this.getRemainTime(this.nextNext);
    },

    cvxCurrentDur() {
      console.log(this.cvxCurrent)
      return this.getRemainTime(this.cvxCurrent);
    },
    cvxNextDur() {
      console.log(this.cvxNext)
      return this.getRemainTime(this.cvxNext);
    },
    cvxNextNextDur() {
      console.log(this.cvxNextNext)
      return this.getRemainTime(this.cvxNextNext);
    },
  },

  watch: {
    proposal() {
      this.setTime();
    },
  },
  created() {
    this.setTime();
    this.loopSetNow();
    this.$emit('change', this.list[0]);
  },

  methods: {
    onTypeChange(type) {
      this.$emit('change', this.list[0]);
      this.$emit('changeVoteType', type);
    },

    onClick(item) {
      if (this.voteType === 'VeCRV') {
        this.$emit('change', item);
      }
    },

    setTime() {
      const today = moment.utc();
      const thursday = moment.utc().day(4).startOf('day');

      if (today.isBefore(thursday)) {
        this.current = thursday.clone();
        this.next = thursday.clone().add(7, 'day');
        this.nextNext = thursday.clone().add(14, 'day');
      } else {
        this.current = thursday.clone().add(7, 'day');
        this.next = thursday.clone().add(14, 'day');
        this.nextNext = thursday.clone().add(21, 'day');
      }

      const cvxThursday = moment(this.proposal.end * 1000).utc().startOf('day');

      if (today.isBefore(cvxThursday)) {
        this.cvxCurrent = cvxThursday.clone();
        this.cvxNext = cvxThursday.clone().add(14, 'day');
        this.cvxNextNext = cvxThursday.clone().add(28, 'day');
      } else {
        this.cvxCurrent = thursday.clone().add(14, 'day');
        this.cvxNext = thursday.clone().add(28, 'day');
        this.cvxNextNext = thursday.clone().add(42, 'day');
      }
    },

    getRemainTime(targetTime) {
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
  display: grid;
  grid-template-rows: 130px 317px;
  .header {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    padding-right: 10px;
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
  }

  .content {
    display: grid;
    grid-template-columns: 670px 530px;
    height: 317px;
    cursor: pointer;

    .left {
      display: grid;
      border-right: 1px solid $border-color;
      box-sizing: border-box;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      & .title {
        margin-bottom: 24px;
        font-size: 30px;
      }
      & .desc {
        margin-bottom: 24px;
        font-size: 18px;
      }

      & .time {
        font-size: 18px;
        color: #CCCCCC;
        & em {
          color: #1DD186;
          font-style: normal;
        }
      }
      &.active {
        padding: 9px;
        border: 3px solid;
        border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
      }
    }

    .right {
      display: grid;
      grid-template-rows: 1fr 1fr;

      & .title {
        margin-bottom: 18px;
        font-size: 30px;
      }

      & .time {
        font-size: 18px;
        color: #CCCCCC;
        & em {
          color: #1DD186;
          font-style: normal;
        }
      }
    }

    .right-top {
      // border-bottom: 1px solid $border-color;
      box-sizing: border-box;
      padding: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &.vlcvx {
        opacity: 0.6;
      }
      &.active {
        padding: 6px 5px;
        border: 3px solid;
        border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
      }
    }

    .right-bottom {
      padding: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-top: 1px solid $border-color;
      &.vlcvx {
        opacity: 0.6;
      }
       &.active {
        padding: 6px 5px 5px;
        border: 3px solid;
        border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
      }
    }
  }
}
</style>
