<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        Current Bribe
      </span>
    </div>

    <div class="content">
      <div class="left"
        :class="{active: selected === 0}"
        v-if="list && list[0]"
        @click="$emit('change', 0)"
      >
        <h5 class="title">{{ list[0].title }}</h5>
        <div class="desc">{{ list[0].desc }}</div>
        <div class="time">Time Remaining to Vote:
          <em>{{list[0].time | formatTime('DD')}}</em>d
          <em>{{list[0].time | formatTime('hh')}}</em>h
          <em>20</em>min <em>36</em>s
        </div>
      </div>
      <div class="right">
        <div class="right-top" :class="{active: selected === 1}"  v-if="list && list[1]"
        @click="$emit('change', 1)"
        >
          <h5 class="title">{{ list[1].title }}</h5>
          <div class="time">Bribe deadline:
            <em>{{list[0].time | formatTime('DD')}}</em>d
            <em>{{list[0].time | formatTime('hh')}}</em>h
            <em>20</em>min
            <em>36</em>s
          </div>
        </div>
        <div class="right-bottom" :class="{active: selected === 2}"  v-if="list && list[2]"
        @click="$emit('change', 2)"
        >
          <h5 class="title">{{ list[2].title }}</h5>
          <div class="time">Bribe deadline:
            <em>{{list[0].time | formatTime('DD')}}</em>d
            <em>{{list[0].time | formatTime('hh')}}</em>h
            <em>20</em>min
            <em>36</em>s
          </div>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  props: {
    selected: {
      type: Number,
    },
    list: {
      type: Array,
    }
  }
}
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
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
