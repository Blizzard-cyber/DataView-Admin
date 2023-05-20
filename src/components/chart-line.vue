<template>
  <div ref="myChart" :style="{ height: height, width: width }"></div>
</template>

<script>
import * as echarts from "echarts";
let chart = null;

export default {
  name: 'chart-line',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    // y轴名
    label: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: function () {
        return [];
      }
    },
    threshold: {
      type: Number
    },
    options: {
      type: Object
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.render();
      }
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeHandler);
  },
  methods: {
    // 初始化渲染
    initChart() {
      chart = echarts.init(this.$refs.myChart);
      this.render();
    },
    // 重复渲染
    render() {
      if (chart) {
        const defaultOptions = {
          // data中数据大于1条时展示图例
          legend: {
            show: this.data.length > 1
          },
          grid: {
            containLabel: true,
            top: 10,
            left: 10,
            right: 10,
            bottom: 10
          },
          xAxis: {
            type: 'time',
            // x轴不显示刻度
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: this.label
          },
          tooltip: {
            trigger: 'axis',
            // tooltip 框限制在图表的区域内
            confine: true
          }
        };
        // 内置一条markLine
        const defaultMarkLine = {
          data: [
            {
              yAxis: this.threshold,
              label: {
                formatter: (e) => {
                  return this.label.match(/\(([^)]+)\)/)
                      ? `${e.value} ${this.label.match(/\(([^)]+)\)/)[1]}`
                      : e.value;
                }
              }
            }
          ],
          symbol: 'none',
          label: {
            color: 'red'
          },
          lineStyle: {
            color: 'red',
            type: [5, 5]
          }
        };
        // 清空并更新series数据
        chart.clear();
        defaultOptions['series'] = this.data.map((row) => {
          return {
            name: row.name,
            data: row.data,
            type: 'line',
            showSymbol: false
          };
        });
        // 设置阈值
        if (this.threshold && defaultOptions.series?.[0]?.data?.length > 0) {
          defaultOptions.series.push(
              { type: 'line', markLine: defaultMarkLine }
          );
        }
        // 合并自定义options
        this.options && this.recursiveMerge(defaultOptions, this.options);
        chart.setOption(defaultOptions);
      }
    },
    resizeHandler() {
      chart && chart.resize();
    },
    // 递归合并
    recursiveMerge(base, extend) {
      if (!this.isPlainObject(base)) {
        return extend;
      }
      for (const key in extend) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        base[key] =
            this.isPlainObject(base[key]) && this.isPlainObject(extend[key])
                ? this.recursiveMerge(base[key], extend[key])
                : extend[key];
      }
      return base;
    },
    // 判断输入是否为对象
    isPlainObject(input) {
      return input && typeof input === 'object' && !Array.isArray(input);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
    if (!chart) {
      return;
    }
    chart.dispose();
    chart = null;
  }
};
</script>

<style scoped></style>