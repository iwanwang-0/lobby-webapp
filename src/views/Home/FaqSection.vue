<template>
  <b-container class="faq-section" fluid="lg">
    <h2>FAQ</h2>
    <div class="scroll-wrapper" @mouseenter="isHover = true" @mouseleave="isHover = false">
      <div class="scroll-container">
        <div class="scroll-inner">
          <div class="row-1" :style="{transform:`translate3d(-${row1Pos}px, 0, 0)`}">
            <div class="faq-item" v-for="item in row1List">
              <h4 class="faq-title">{{item.title}}</h4>
              <div class="faq-desc">{{item.desc}}</div>
            </div>
            <!-- <div class="faq-item">
              <h4>{{item.title}}</h4>
              <div>{{item.desc}}</div>
            </div>
            <div class="faq-item">
              <h4>{{item.title}}</h4>
              <div>{{item.desc}}</div>
            </div> -->

            <div class="faq-item" v-for="item in row1List.slice(0, 3)">
              <h4 class="faq-title">{{item.title}}</h4>
              <div class="faq-desc">{{item.desc}}</div>
            </div>
          </div>

          <div class="row-2" :style="{transform:`translate3d(-${row2Pos}px, 0, 0)`}">
            <!-- <div class="faq-item">D</div>
            <div class="faq-item">E</div>
            <div class="faq-item">F</div>
            <div class="faq-item">G</div> -->

            <div class="faq-item" v-for="item in row2List">
              <h4 class="faq-title">{{item.title}}</h4>
              <div class="faq-desc">{{item.desc}}</div>
            </div>

            <div class="faq-item" v-for="item in row2List.slice(0, 4)">
              <h4 class="faq-title">{{item.title}}</h4>
              <div class="faq-desc">{{item.desc}}</div>
            </div>

            <!-- <div class="faq-item">D</div>
            <div class="faq-item">E</div>
            <div class="faq-item">F</div>
            <div class="faq-item">G</div> -->

          </div>
        </div>
      </div>
    </div>
 </b-container>
</template>

<script>
export default {
  data() {
    return {
      isHover: false,
      duration: 10000,
      start: Date.now(),
      row1Pos: 0,
      row2Pos: 0,

      row1List: [
        {
          title: 'A. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
        {
          title: 'B. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
        {
          title: 'C. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
      ],

      row2List: [
        {
          title: 'D. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
        {
          title: 'E. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
        {
          title: 'F. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
        {
          title: 'G. Vote bribery platform',
          desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        },
        // {
        //   title: 'H. Vote bribery platform',
        //   desc: 'You must ensure that you have a vetoken to participate,must ensure thatvetoken to participate',
        // },
      ],
    };
  },

  mounted() {
    this.runFrame();
  },

  methods: {

    runFrame() {
      requestAnimationFrame(() => {
        if (this.isHover) {
          this.runFrame();
          return;
        }
        const step = 2;
        if (this.row1Pos >= 410 * 3) {
          this.start = Date.now();
          this.row1Pos = 0;
        } else {
          this.row1Pos += step;
        }

        if (this.row2Pos >= 410 * 4) {
          this.start = Date.now();
          this.row2Pos = 0;
        } else {
          this.row2Pos += step;
        }
        this.runFrame();
      });
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.faq-section {
  border-top: 1px solid $border-color;
  height: 512px;
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
}

h2 {
  line-height: 60px;
  width: 100px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 33px;
  height: 60px;
  font-size: 48px;
  background: linear-gradient(200deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.scroll-wrapper {
  // display: flex;
  // flex-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 36px;
}

.scroll-inner {
  display: inline-flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  overflow: hidden;
  width: 100%;
}

.row-1 {
  display: flex;
  flex-wrap: nowrap;
}

.row-2 {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 36px;
  margin-left: -190px;
}

.faq-item {
  width: 380px;
  height: 173px;
  border: 1px solid #666666;
  filter: blur(0px);
  cursor: pointer;
  margin-right: 30px;
  font-family: "ChillPixels Maximal";

  .faq-title {
    height: 60px;
    line-height: 60px;
    width: 380px;
    color: #1DD186;
    padding-left: 10px;
    border-bottom: 1px dashed #666666;;
    margin: 0;
    font-size: 24px;
  }

  .faq-desc {
      padding: 10px;
      white-space: pre-wrap;
      font-size: 18px;
  }
}
</style>
