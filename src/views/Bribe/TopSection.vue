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
          @click="$emit('changeVoteType', 'VeCRV')"

        >
          VeCRV
        </b-button>
        <b-button
          class="link-btn"
          :variant="voteType === 'VlCVX' ? 'primary' : 'outline-primary'"
          size="lg"
          @click="$emit('changeVoteType', 'VlCVX')"
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
          <em>{{currentDur.date}}</em>d
          <em>{{currentDur.hour}}</em>h
          <em>{{currentDur.minute}}</em>min
          <em>{{currentDur.second}}</em>s
        </div>
      </div>
      <div class="right">
        <div class="right-top" :class="{active: selected === 1}"  v-if="list && list[1]"
        @click="onClick(list[1])"
        >
          <h5 class="title">{{ list[1].title }}</h5>
          <div class="time">Bribe deadline:
            <em>{{nextDur.date}}</em>d
            <em>{{nextDur.hour}}</em>h
            <em>{{nextDur.minute}}</em>min
            <em>{{nextDur.second}}</em>s
          </div>
        </div>
        <div class="right-bottom" :class="{active: selected === 2}"  v-if="list && list[2]"
        @click="onClick(list[2])"
        >
          <h5 class="title">{{ list[2].title }}</h5>
          <div class="time">Bribe deadline:
            <em>{{nextNextDur.date}}</em>d
            <em>{{nextNextDur.hour}}</em>h
            <em>{{nextNextDur.minute}}</em>min
            <em>{{nextNextDur.second}}</em>s
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
    // list: {
    //   type: Array,
    // },
  },
  data() {
    const today = moment.utc();
    const thursday = moment.utc().day(4).startOf('day');
    let current;
    let next;
    let nextNext;
    if (today.isBefore(thursday)) {
      current = thursday.clone();
      next = thursday.clone().add(7, 'day');
      nextNext = thursday.clone().add(14, 'day');
    } else {
      current = thursday.clone().add(7, 'day');
      next = thursday.clone().add(14, 'day');
      nextNext = thursday.clone().add(21, 'day');
    }

    return {
      // voteType: 'VeCRV',

      now: Date.now(),
      current,
      next,
      nextNext,
      list: [
        {
          idx: 0,
          title: `Current Bribe (${current.format('MMMM D')})`,
          desc: `The veCRV Gauge voting award for the week of ${current.local().format('MMMM D HH:mm a')} GMT${current.local().format('ZZ')}`,
          time: current,
          // time: 'Time Remaining to Vote: <em>03</em>d <em>13</em>h <em>20</em>min <em>36</em>',
        },
        {
          idx: 1,
          title: `Next round of Bribe (${next.format('MMMM D')})`,
          time: next,
        },
        {
          idx: 2,
          title: `The third round of Bribe (${nextNext.format('MMMM D')})`,
          time: nextNext,
        },
      ],
    };
  },
  computed: {
    currentDur() {
      return this.getRemainTime(this.current);
    },
    nextDur() {
      return this.getRemainTime(this.next);
    },
    nextNextDur() {
      return this.getRemainTime(this.nextNext);
    },
  },
  created() {
    this.loopSetNow();
    this.$emit('change', this.list[0]);
  },

  methods: {
    onClick(item) {
      this.$emit('change', item);
    },

    // changeVoteType(type) {
    //   this.voteType = type;
    // },

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
       &.active {
        padding: 6px 5px 5px;
        border: 3px solid;
        border-image: linear-gradient(199deg, rgba(239, 146, 55, 1), rgba(0, 221, 89, 1)) 3 3;
      }
    }
  }
}
</style>
