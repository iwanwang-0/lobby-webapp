<template>
  <!-- <div class=""> -->
  <b-overlay :show="loading" :opacity="0.4" bg-color="#000">
   <b-container class="top-section" fluid="lg">
        <div v-show="!loading && !chartData.length" class="empty-content" >
          <img style="height: 145px;" src="~@/assets/img/no-data@2x.png" alt="">
          <div class="empty-text">No data here...</div>
        </div>
        <div v-show="!loading && chartData.length" class="chart" ref="chart">
      </div>
    </b-container>
  </b-overlay>

  <!-- </div> -->
</template>

<script>
import { mapState } from 'vuex';
import * as echarts from 'echarts';
import { fetchGaugeRewards, fetchUserScore } from '@/api/dashbord';
import toFixed from '@/filters/toFixed';
import { BigNumber } from 'ethers';

export default {
  props: {
    voteType: {
      type: String,
    },
    round: {
      type: Number,
    },
    market: {
      type: String,
    },
  },
  data() {
    // prettier-ignore
    // const dataAxis = [
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    //   'FRAX+3CRV(0xd632…)',
    // ];
    // // prettier-ignore
    // const data = [{
    //   value: 220,
    //   list: [
    //     {
    //       label: 'USDT',
    //       value: '100',
    //     },
    //     {
    //       label: 'USDC',
    //       value: '200',
    //     },
    //   ],
    // }, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];

    // const yMax = 500;
    // const dataShadow = [];
    // for (let i = 0; i < data.length; i++) {
    //   dataShadow.push(yMax);
    // }
    return {
      WEEK_SECONDS: 7 * 24 * 60 * 60,

      loading: false,
      dataAxis: [],
      chartData: [],

      option: {},
    };
  },

  computed: {
    ...mapState(['user', 'guageNameMap', 'tokenMap']),

  },
  watch: {
    voteType() {
      this.dataAxis = [];
      this.chartData = [];
      this.getList();
    },
    market() {
      this.dataAxis = [];
      this.chartData = [];
      this.getList();
    },
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.chart);

    this.getList();
  },

  methods: {
    async updateOption() {
      this.option = {
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: '#4C4C4C',
          borderColor: '#4C4C4C',
          textStyle: {
            color: '#fff',
            fontFamily: 'ChillPixels Mono',
            fontSize: 12,
          },
          padding: [2, 5],
          formatter(params, ticket) {
            if (params.data.list) {
              return params.data.list.map((item) => `${item.label}: ${item.value}`).join('<br>');
            }
          },
          position(point, params, dom, rect, size) {
            return [point[0], point[1]];
          },
        },
        grid: {
          containLabel: true,
          top: 50,
          bottom: 40,
          left: 30,
          right: 30,
        },
        xAxis: {
          data: this.dataAxis,
          axisLabel: {
            color: '#999',
            rotate: 45,
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
        },
        // dataZoom: [
        //   {
        //     type: 'inside',
        //   },
        // ],
        series: [
          {
            type: 'bar',
            barMaxWidth: 45,
            itemStyle: {
              color: '#1DD186',
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF460E' },
                  { offset: 0.44, color: '#ECA13F' },
                  { offset: 1, color: '#00DD59' },
                ]),
              },
            },
            data: this.chartData,
          },
        ],
      };
      this.myChart.setOption(this.option);
      this.myChart.resize();
    },
    async getList() {
      this.loading = true;
      const res = await fetchGaugeRewards({
        witch: this.voteType === 'VeCRV' ? 'crv' : 'cvx',
        platform: this.market.toLowerCase(),
        round: this.round * this.WEEK_SECONDS,
      });

      this.loading = false;
      if (res.success) {
        const gaugeRewardsList = Object.keys(res.data.gaugeRewards).map((key) => {
          const tokenAddrMap = res.data.gaugeRewards[key];
          const tokenList = Object.keys(tokenAddrMap)
            .filter((item) => item !== 'totalValue')
            .map((tokenAddr) => {
              const tokenInfo = this.tokenMap[tokenAddr.toLowerCase()];
              return {
                label: tokenInfo.symbol,
                value: toFixed(tokenAddrMap[tokenAddr].hex / 10 ** tokenInfo.decimals, 4),
              };
            });
          const guageName = this.guageNameMap[key.toLowerCase()].shortName;
          return {
            guage: key,
            guageNameShort: `${guageName.slice(0, 10)}...${guageName.slice(-10)}`,
            guageName,
            total: tokenAddrMap.totalValue,
            list: tokenList,
          };
        }).sort((a, b) => a.total - b.total);
        this.dataAxis = gaugeRewardsList.map((item) => item.guageNameShort);
        this.chartData = gaugeRewardsList.map((item) => ({
          value: item.total,
          list: item.list,
        }));
      }
      this.updateOption();
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
    height: 458px;
  }
.chart {
  height: 458px;
  width: 1198px;

}
.empty-content {
    text-align: center;
    // font-size: 0;
    padding: 128px;
  }

  .empty-text {
    margin-top: 16px;
    color: #CCCCCC;
    margin-left: 24px;
  }
</style>
