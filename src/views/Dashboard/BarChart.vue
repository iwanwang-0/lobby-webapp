<template>
  <!-- <div class=""> -->
    <div class="chart" ref="chart">

    </div>
  <!-- </div> -->
</template>

<script>
import * as echarts from "echarts"

export default {
  data() {
    // prettier-ignore
    const dataAxis = [
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
      'FRAX+3CRV(0xd632…)',
    ];
    // prettier-ignore
    const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    const yMax = 500;
    const dataShadow = [];
    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }
    return {
      option: {
        tooltip: {
          show: true,
          trigger: 'item',
          // position: [10, 10]
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
          data: dataAxis,
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
            data,
          },
        ],
      },
    };
  },
  mounted() {
    console.log(this.$refs.chart)
    const myChart = echarts.init(this.$refs.chart);

    // console.log(myChart)
    myChart.setOption(this.option);
  },
};
</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
}
</style>
