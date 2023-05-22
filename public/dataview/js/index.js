var ta = 25;
var wholedata = [];
var total = []; //飞行员总人数
var abnormal = []; //飞行员异常人数
var data1 = []; //飞行员基本生命体征异常情况统计(1*5)
var data2 = []; //飞行员基本生命体征异常情况趋势(4*n)
var data3 = []; //飞行员综合状态分布(1*4)
var data4 = []; //飞行员心理状态异常情况统计(1*5)
var data5 = []; //飞行员心理状态异常情况趋势(4*n)
var data6 = []; //飞行员异常状态情况分布(1*4)
window.addEventListener("message", function(event) {
  // 访问传递的数据
  wholedata = event.data;
  total = wholedata[0][0];
  abnormal = wholedata[0][1];
  data1 = wholedata[1];
  data2 = wholedata[2];
  data3 = wholedata[3];
  data4 = wholedata[4];
  data5 = wholedata[5];
  data6 = wholedata[6];
  //console.log(total)
 
}); 

// 柱状图1模块
(function () {
  // 实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"));
  // 指定配置和数据
  var option = {
    color: ["#2f89cf", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: "0%",
      top: "10px",
      right: "0%",
      bottom: "4%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: [
          "异常总人数",
          "心率异常",
          "血氧异常",
          "血流灌注异常",
          "呼吸率异常",
        ],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "10"
          }
        },
        axisLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12"
          }
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)"
            // width: 1,
            // type: "solid"
          }
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)"
          }
        }
      }
    ],
    series: [
      {
        name: "飞行员人数",
        type: "bar",
        barWidth: "35%",
        data: [0,0,0,0,0],
        itemStyle: {
          normal: {
            barBorderRadius: 5,
            color: (val) => {
              var colorList = ["#2f89cf", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
              return colorList[val.dataIndex % 5]
            }
          }
        }
      }
    ]
  };

  // 把配置给实例对象
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });

  // 数据变化
  // var dataAll = [
  //   { year: "2019", data: [200, 300, 300, 900, 1500, 1200, 600] },
  //   { year: "2020", data: [300, 400, 350, 800, 1800, 1400, 700] }
  // ];

  // document.querySelector(".bar h2").addEventListener("click", function (e) {
  //   var i = e.target == this.children[0] ? 0 : 1;
  //   option.series[0].data = dataAll[i].data;
  //   myChart.setOption(option);
  // });
  var index1 = 0;
  setInterval(() => {
    if (data1.length !== 0) {
      option.series[0].data = data1[index1 % data1.length];
      index1++;
      
    }
    myChart.setOption(option);
  }, 1000);

})();

// 折线图定制
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".line .chart"));

  // (1)准备数据
  var data = {
    month: [
      [0],
      [0],
      [0],
      [0]
      // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      // [13, 18, 4, 16, 21, 19, 16, 12, 5, 17, 1, 15, 9, 18,13],
      // [19, 4, 16, 10, 24, 8, 6, 16, 12, 21, 12, 19, 5, 2,15 ],
      // [18, 14, 24, 23, 14, 15, 18, 15, 2, 5, 13, 19, 11, 10,26],
      // [6, 10, 0, 18, 14, 18, 8, 6, 18, 19, 19, 24, 16, 15,25 ],
    ]
  };

  // 2. 指定配置和数据
  var option = {
    color: ["#F57474", "#56D0E3", "#F8B448", "#8B78F6"],
    tooltip: {
      // 通过坐标轴来触发
      trigger: "axis"
    },
    legend: {
      // 距离容器10%
      right: "10%",
      // 修饰图例文字的颜色
      textStyle: {
        color: "#4c9bfd"
      }
      // 如果series 里面设置了name，此时图例组件的data可以省略
      // data: ["邮件营销", "联盟广告"]
    },
    grid: {
      top: "20%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      show: true,
      borderColor: "#012f4a",
      containLabel: true
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
      ],
      // 去除刻度
      axisTick: {
        show: false
      },
      // 修饰刻度标签的颜色
      axisLabel: {
        color: "rgba(255,255,255,.7)"
      },
      // 去除x坐标轴的颜色
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      // 去除刻度
      axisTick: {
        show: false
      },
      // 修饰刻度标签的颜色
      axisLabel: {
        color: "rgba(255,255,255,.7)"
      },
      // 修改y轴分割线的颜色
      splitLine: {
        lineStyle: {
          color: "#012f4a"
        }
      }
    },
    series: [
      {
        name: "心率异常",
        type: "line",
        //stack: "总量",
        // 是否让线条圆滑显示
        smooth: true,
        data: data.month[0]
      },
      {
        name: "血氧异常",
        type: "line",
        //stack: "总量",
        smooth: true,
        data: data.month[1]
      },
      {
        name: "血流灌注异常",
        type: "line",
        //stack: "总量",
        smooth: true,
        data: data.month[2]
      },
      {
        name: "呼吸率异常",
        type: "line",
        //stack: "总量",
        smooth: true,
        data: data.month[3]
      }
    ]
  };
  // 3. 把配置和数据给实例对象
  myChart.setOption(option);

  // 重新把配置好的新数据给实例对象
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
  // 折线刷新
  var xaxi = 15;
  var isinit=false;
  setInterval(() => {
    if (data2.length !== 0) { 
      //初始化前15个数据
      if (!isinit) {
        data.month.forEach((element, index) => {
          for (var i = 0; i < 15; i++) {
            element.push(data2[index][i])
          }
        });
        isinit=true;
      }
      
      option.xAxis.data.push(String(xaxi%24)+":00");
      option.xAxis.data.shift();
   
      data.month.forEach((element,index) => {
        element.push(data2[index][xaxi % 24]);
        element.shift();
      });
      xaxi++;
      //console.log(data.month);
    }
   
    myChart.setOption(option);
  }, 1000);
})();

// 饼形图定制
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".pie .chart"));

  var option1 = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: function (p) {
        //其中p为当前鼠标的位置
        return [p[0] + 10, p[1] - 10];
      }
    },
    legend: {
      top: "90%",
      itemWidth: 10,
      itemHeight: 10,
      data: ["优秀", "良好", "较差", "极差"],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "10"
      }
    },
    series: [
      {
        name: "飞行员作战能力",
        type: "pie",
        center: ["50%", "42%"],
        radius: ["40%", "60%"],
        color: [
          "#56D0E3",
          "#1089E7",
          "#F8B448",
          "#F57474",
        ],
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 0, name: "优秀" },
          { value: 0, name: "良好" },
          { value: 0, name: "较差" },
          { value: 0, name: "极差" },
        ]
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option1);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
  var index3 = 0;
  setInterval(() => {
    if (data3.length > 0) { 
      //option1.series[0].data = data3[5];
      option1.series[0].data = data3[index3 % data3.length];
      index3 += 1;
    }
    myChart.setOption(option1);
    // console.log(option1);
  }, 1000);
})();


// 学习进度柱状图模块
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".bar1 .chart"));

  var data = [0, 0, 0, 0, 0];
  var titlename = ["异常总人数", "情感异常", "压力异常", "极度疲劳", "心脏状态异常"];
  var valdata = ["0人", "0人", "0人", "0人", "0人"];
  var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
  var option = {
    //图标位置
    grid: {
      top: "10%",
      left: "22%",
      bottom: "10%"
    },
    xAxis: {
      show: false
    },
    yAxis: [
      {
        show: true,
        data: titlename,
        inverse: true,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: "#fff",

          rich: {
            lg: {
              backgroundColor: "#339911",
              color: "#fff",
              borderRadius: 15,
              // padding: 5,
              align: "center",
              width: 15,
              height: 15
            }
          }
        }
      },
      {
        show: true,
        inverse: true,
        data: valdata,
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: "#fff"
          }
        }
      }
    ],
    series: [
      {
        name: "条",
        type: "bar",
        yAxisIndex: 0,
        data: data,
        barCategoryGap: 50,
        barWidth: 10,
        itemStyle: {
          normal: {
            barBorderRadius: 20,
            color: function (params) {
              var num = myColor.length;
              return myColor[params.dataIndex % num];
            }
          }
        }
      },

    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });

  var index4 = 0;
  setInterval(() => {
    if (data4.length > 0) { 
      data = data4[index4 % data4.length];
      for (var i = 0; i < 5; i++) { 
        valdata[i] = String(data[i]) + "人";
      }
      index4 += 1;
    }
    // data[0] =  ta - Math.floor(Math.random() * 5);
    // valdata[0] = String(data[0]) + "人";

    // for(var i=1;i<5;i++) {
    //   data[i] += (Math.floor(Math.random() *3)-1)*Math.floor(Math.random() * 3);
    //   if(data[i] < 0){
    //     data[i] = 0;
    //   }
    //   if (data[i] > data[0]){
    //     data[i] = data[0] - Math.floor(Math.random() * 3);
    //   }
    //   valdata[i] = String(data[i]) + "人";
    // }
    if(data[0] > data[1] + data[2] + data[3] +data[4]){
      data[0] = data[1] + data[2] + data[3] +data[4]
    }
    option.data = valdata;
    option.series[0].data = data;
    myChart.setOption(option);
  }, 1000);
    
})();


// 折线图 优秀作品
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".line1 .chart"));

  // (1)准备数据
  var data = {
    month: [
      [0],
      [0],
      [0],
      [0]
    ]
  };
  var option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#dddc6b"
        }
      }
    },
    legend: {
      top: "0%",
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12"
      }
    },
    grid: {
      left: "10",
      top: "30",
      right: "10",
      bottom: "10",
      containLabel: true
    },

    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12
          }
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.2)"
          }
        },

        data: [
          "0:00",
          "1:00",
          "2:00",
          "3:00",
          "4:00",
          "5:00",
          "6:00",
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00"
        ]
      },
      {
        axisPointer: { show: false },
        axisLine: { show: false },
        position: "bottom",
        offset: 20
      }
    ],

    yAxis: [
      {
        type: "value",
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)"
          }
        },
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 12
          }
        },

        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)"
          }
        }
      }
    ],
    series: [
      {
        name: "情感异常",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#F57474",
            width: 2
          }
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
                    color: "rgba(245, 116, 116, 0.4)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(245, 116, 116, 0.1)"
                  }
                ],
                false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)"
          }
        },
        itemStyle: {
          normal: {
            color: "#F57474",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12
          }
        },
        data: data.month[0]
      },
      {
        name: "压力异常",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#56D0E3",
            width: 2
          }
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
                    color: "rgba(86, 208, 227, 0.4)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(86, 208, 227, 0.1)"
                  }
                ],
                false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)"
          }
        },
        itemStyle: {
          normal: {
            color: "#56D0E3",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12
          }
        },
        data: data.month[1]
      },
      {
        name: "极度疲劳",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#F8B448",
            width: 2
          }
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
                  color: "rgba(248, 180, 72, 0.4)"
                },
                {
                  offset: 0.8,
                  color: "rgba(248, 180, 72, 0.1)"
                }
              ],
              false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)"
          }
        },
        itemStyle: {
          normal: {
            color: "#F8B448",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12
          }
        },
        data: data.month[2]
      },
      {
        name: "心脏状态异常",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: "#8B78F6",
            width: 2
          }
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
                  color: "rgba(139, 120, 246, 0.4)"
                },
                {
                  offset: 0.8,
                  color: "rgba(139, 120, 246, 0.1)"
                }
              ],
              false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)"
          }
        },
        itemStyle: {
          normal: {
            color: "#8B78F6",
            borderColor: "rgba(221, 220, 107, .1)",
            borderWidth: 12
          }
        },
        data: data.month[3]
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });

  var xaxi = 15;
  var isinit = false;
  setInterval(() => {
    // console.log(option);
    if (data5.length !== 0) { 
      //初始化前15个数据
      if (!isinit) {
        data.month.forEach((element, index) => {
          for (var i = 0; i < 15; i++) {
            element.push(data5[index][i])
          }
        });
        isinit=true;
      }
      //console.log(option.xAxis[0].data);
      option.xAxis[0].data.push(String(xaxi%24)+":00");
      option.xAxis[0].data.shift();
   
      data.month.forEach((element,index) => {
        element.push(data5[index][xaxi % 24]);
        element.shift();
      });
      xaxi++;
      //console.log(data.month);
    }
    
    myChart.setOption(option);
  }, 1000);
})();

// 点位分布统计模块
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".pie1  .chart"));
  // 2. 指定配置项和数据
  var option = {
    legend: {
      top: "90%",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12"
      }
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // 注意颜色写的位置
    color: [
      "#006cff",
      "#F8B448",
      "#ff9f7f",
      "#ed8884",
    ],
    series: [
      {
        name: "点位统计",
        type: "pie",
        // 如果radius是百分比则必须加引号
        radius: ["10%", "70%"],
        center: ["50%", "42%"],
        roseType: "radius",
        data: [
          { value: 0, name: "无异常状态" },
          { value: 0, name: "生理状态异常" },
          { value: 0, name: "心理状态异常" },
          { value: 0, name: "生理、心理状态异常" },
        ],
        // 修饰饼形图文字相关的样式 label对象
        label: {
          fontSize: 10
        },
        // 修饰引导线样式
        labelLine: {
          // 连接到图形的线长度
          length: 10,
          // 连接到文字的线长度
          length2: 10
        }
      }
    ]
  };

  // 3. 配置项和数据给我们的实例化对象
  myChart.setOption(option);
  // 4. 当我们浏览器缩放的时候，图表也等比例缩放
  window.addEventListener("resize", function () {
    // 让我们的图表调用 resize这个方法
    myChart.resize();
  });

  
  var index6 = 0;
  setInterval(() => {
    if (data6.length > 0) { 
      //option1.series[0].data = data3[5];
      option.series[0].data = data6[index6 % data6.length];
      index6 += 1;
    }
    myChart.setOption(option);
    // console.log(option1);
  }, 1000);
})();


//监测飞行员总人数
(function () {
  var index = 0;
  var ab = document.getElementsByClassName("total");
  setInterval(() => {
    if (total.length !== 0) {
      ab[0].innerHTML = total[index % total.length];
      index += 1;
      //console.log(ab[0].innerHTML);
    }
  }, 1000);

})();

//异常飞行员总人数
(function () {
  var index = 0;
  var ab = document.getElementsByClassName("total-abnormal");
  setInterval(() => {
    if (abnormal.length !== 0) {
      ab[0].innerHTML = abnormal[index % abnormal.length];
      index += 1;
      //console.log(ab[0].innerHTML);
    }
  }, 1000);

})();