// 封装的echarts折线图公共组件
<template>
  <div
    :class="className"
    :style="{ height:height,width:width }"
  />
</template>

<script>
import * as echarts from "echarts";
//import resize from "../mixin/resize";  // 用于echarts自适应窗口

export default {
  //mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ xData, yName, color, data } = {}) {
      const { seriesList } = this.createSeries(data);
      this.chart.setOption({
        backgroundColor: "transparent",
        grid: {
          left: "5%",
          right: "10%",
          top: "20%",
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        color,
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "rgba(154, 161, 179, 1)",
            },
          },
        },
        yAxis: {
          name: yName,
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              width: 0.5,
              color: "#A1A7B3",
              type: "dashed",
            },
          },
          axisLine: {
            show: true,
          },
        },
        series: seriesList,
        dataZoom: [
            {
              type:'slider',//滑块模式
              show: true, //是否显示下滑块
              height: 20,//滑块高度
              xAxisIndex: 0, //对x轴生效
              //filterMode:'filter',
              buttom:50,
              
              // start: 0,
              // end: 1000,
              startValue:100,
              endValue: 1000,
            },
            {
              type:'inside',
              xAxisIndex:0,
              filterMode:'filter',
              start:0,
              end:1000
            }
          ]

      });
    },
    createSeries(data) {
      const legend = [];
      const companySeries = function (name, color, data) {
        return {
          name: name,
          type: "line",
          showSymbol: false,
          itemStyle: {
            normal: {
              color: color,
              lineStyle: {
                color: color,
                width: 1,
              },
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(3, 139, 255, 0.4)",
                  },
                  {
                    offset: 1,
                    color: "rgba(3, 139, 255, 0)",
                  },
                ],
                false
              ),
            },
          },
          data: data,
        };
      };
      const seriesList = data.map((item) => {
        legend.push(item.title);
        return companySeries(item.title, item.color, item.data);
      });
      return { seriesList, legend };
    },
  },
};
</script>

