<template>
    <div>
        <!-- <Row>
             <Progress :percent="90" :stroke-color="['#108ee9', '#87d068']" />
        </Row> -->
        <Row type="flex" justify="center" align="middle">
            <Col span="8">
                <Card style="width:350px">
                    <p slot="title">
                      <Icon type="ios-planet-outline" />
                        训练任务信息
                    </p>
                    <a href="#" slot="extra" @click.prevent="changeLimit">
                        返回
                    </a>
                    <ul>
                        <li v-for="(item,index) in infoList" :key="index">
                            <span>{{item.label}}</span>
                            <span>
                                  
                                {{ item.value  }}
                            </span>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col span="16">
            <div>
                <Row>
                   
                    
                        <Card :padding="0"> 
                            <ChartLine :data="testData" :label="'温度'" :threshold="30" :options="{}"></ChartLine>
                        </Card>
                        <span style="text-align: center;display:block;">loss</span>
                    
                </Row>
                <Row>
                     <Card :padding="0"> 
                        <ChartLine :data="testData" :label="'温度'" :threshold="30" :options="{}"></ChartLine>
                    </Card>
                    <span style="text-align: center;display:block;">loss</span>
                </Row>
                <Row>
                    <Card :padding="0"> 
                        <ChartLine :data="testData" :label="'温度'" :threshold="30" :options="{}"></ChartLine>
                    </Card>
                    <span style="text-align: center;display:block;">loss</span>
                </Row>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { EventSourcePolyfill } from 'event-source-polyfill';
import ChartLine from "@/components/chart-line.vue";
import {getSubscribeTrainApi} from "@/network/api/trainApi";
import util from "@/util";
export default {
    data() {
        return {
            changed: false, //监听路由是否变化
            trainId: '',
            infoList:[],
            testData: [
                {
                name: '上海',
                data: [
                    ['2022-08-06 17:20:20', 15],
                    ['2022-08-06 17:30:20', 20],
                    ['2022-08-06 17:40:20', 30],
                    ['2022-08-06 17:50:20', 25],
                    ['2022-08-06 18:00:20', 35],
                    ['2022-08-06 18:10:20', 10],
                ]
                },
                {
                name: '北京',
                data: [
                    ['2022-08-06 17:20:20', 25],
                    ['2022-08-06 17:30:20', 10],
                    ['2022-08-06 17:40:20', 20],
                    ['2022-08-06 17:50:20', 15],
                    ['2022-08-06 18:00:20', 30],
                    ['2022-08-06 18:10:20', 35],
                ]
                }
            ]  
        }
    },
    components: {
        ChartLine
    },
    

    created() {
        this.trainId = this.$route.params.id
        this.getSubscribeTrain(this.trainId)
        //this.subscribe()
    },
    watch: {
        'route': 'hasChanged'
        // $route(to, from) {
        //     this.subscribe()
        // }
    },
    methods: {
        subscribe() {
            let token=util.storage.get('token')
            console.log(token)
            let that=this
            if(typeof(EventSource) !== "undefined") {  //判断浏览器是否支持EventSource
                const source = new EventSourcePolyfill("/train/subscribe/" + trainId,{
                    headers:{
                        'Auth':token
                    }
                });
                source.onopen = function(event) {
                    console.log("连接打开");
                };
                source.onmessage = function(event) {
                    console.log(event.data);
                    if(!that.changed){
                        source.close()
                        that.changed=false
                    }
                };
                source.onerror = function(event) {
                    console.log("连接发生错误");

                };
            } else {
                console.log("当前浏览器不支持使用EventSource接收服务器推送事件!");
            }
            
        },
        haschanged() {
            this.changed = true
        },
         async  getSubscribeTrain(trainId) {
            let res = await getSubscribeTrainApi(trainId)
            let labelList = ['唯一标识：', '训练名称：', '模型选择：', '轮数：', '学习率：', 'BatchSize:', '切片大小：', '是否监督：', '训练用户：', '任务类型：', '输出类型：', '创建时间:']
            let valueList = ['id', 'name', 'method', 'epoch', 'learningRate', 'batchSize', 'second', 'isSupervised', 'username', 'taskTypeName', 'outputTypeName', 'createDate']
                for(let i = 0; i < labelList.length; i++) {
                    this.infoList.push({
                        label: labelList[i],
                        value: res.data[valueList[i]]
                    })
                }
           
    }
    }
  

}
</script>

<style>
.chart-box{
    width: 100%;
    height: 100%;
}
</style>