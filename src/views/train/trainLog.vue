<template>
    <div>
        <Spin size="large" fix v-if="isLoading"></Spin>
        <!-- <Row>
             <Progress :percent="90" :stroke-color="['#108ee9', '#87d068']" />
        </Row> -->
        <Row type="flex" justify="center" align="middle">
            <Col span="6">
                <Card style="width:100%">
                    <p slot="title">
                      <Icon type="ios-planet-outline" />
                        训练任务信息
                    </p>
                    <a href="#" slot="extra" @click.prevent="changeLimit">
                        返回
                    </a>
                    <ul>
                        <li v-for="(item,index) in infoList" :key="index">
                            <span style="font-weight:bold">
                                {{item.label}}
                            </span>
                            <span style="float:right">      
                                {{ item.value  }}
                            </span>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col span="17" offset='1'>
            <div >
                <Row>
                   
                    
                        <Card :padding="0" style="width:100%"> 
                            <Pline :pdata="pdataAcc" label='acc'></Pline>
                        </Card>
                       
                    
                </Row>
                <br>
                <Row>
                     <Card :padding="0" style="width:100%"> 
                        <Pline :pdata="pdataLoss" label="loss"></Pline>
                    </Card>
                    
                </Row>
                <br>
                <Row>
                    <Card :padding="0" style="width:100%"> 
                       <Pline :pdata="pdataEpoch" label="epoch"></Pline>
                    </Card>
                   
                </Row>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { EventSourcePolyfill } from 'event-source-polyfill';
import Pline from '@/components/Pline.vue'
import {getSubscribeTrainApi,unsubscribeTrainApi} from "@/network/api/trainApi";
import util from "@/util";
import serverConfig from "@/network/config/index.js";

export default {
    data() {
        return {
            isLoading: false,
            changed: false, //监听路由是否变化
            trainId: '',
            infoList:[],
            pdataAcc: {
                time: [],
                dataOne: []
            },
            pdataLoss: {
                time: [],
                dataOne: []
            },
            pdataEpoch: {
                time: [],
                dataOne: []
            },
              
        }
    },
    components: {
       
        Pline
        
    },
    

    created() {
        this.trainId = this.$route.params.id
        this.isLoading = true
        this.getSubscribeTrain(this.trainId)
        this.subscribe()
    },
    beforeRouteLeave(to, from, next) {
        
        //this.$Message.info('离开了')
        this.changed = true //路由变化
       console.log('离开了')
       console.log(this.changed)
        next();
    },
    // watch: {
    //     // 'route': 'hasChanged'
    //     $route:{
    //         handler: 'haschanged',
    //         deep: true
    //     }
    // },
    mounted() {

        //监听页面是否刷新
        window.addEventListener('beforeunload', e => {
            this.beforeunloadFn(e)
           // this.unsubcribe(this.trainId)
        })
        
    },
    destroyed() {
        //页面关闭
        window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    methods: {
        subscribe() {
            const baseUrl = serverConfig.baseURL
            let token=util.storage.get('token')
            //console.log(token)
            let that=this
            const url=baseUrl+'/train/subscribe/'
            //console.log(url)
            if(typeof(EventSource) !== "undefined") {  //判断浏览器是否支持EventSource
                const source = new EventSourcePolyfill(url + this.trainId,{
                    headers:{
                        'Auth':token
                    }
                });
                source.onopen = function(event) {
                    console.log("连接打开");
                };
                source.onmessage = function(event) {
                    //console.log(JSON.parse(event.data));
                    
                    if(event.data==="finish"){
                        //let res=that.unsubcribe(that.trainId)
                        //console.log(res)
                         source.close()
                         console.log("连接关闭")
                        that.$Message.success("训练结束!")    
                    }
                    else if(that.changed){
                        that.unsubcribe(that.trainId)
                        source.close()
                        console.log("连接关闭")
                    }
                    else{
                        that.handleLog(JSON.parse(event.data))
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
           // this.changed = true
           console.log("路由变化")
        },
        handleLog(eventLog){
           //let time= this.transformTimestamp(eventLog.time)
           let time = new Date().toLocaleTimeString()
              this.pdataAcc.time.push(time)
              this.pdataAcc.dataOne.push(eventLog.acc)
              if(this.pdataAcc.time.length>8){
                    this.pdataAcc.time.shift()
                    this.pdataAcc.dataOne.shift()
            }
            this.pdataLoss.time.push(time)
            this.pdataLoss.dataOne.push(eventLog.loss)
            if(this.pdataLoss.time.length>8){
                this.pdataLoss.time.shift()
                this.pdataLoss.dataOne.shift()
            }
            this.pdataEpoch.time.push(time)
            this.pdataEpoch.dataOne.push(eventLog.epoch)
            if(this.pdataEpoch.time.length>8){
                this.pdataEpoch.time.shift()
                this.pdataEpoch.dataOne.shift()
            }
        this.isLoading=false
        },
        beforeunloadFn(e){
             this.unsubcribe(this.trainId)
             console.log(e)
             console.log("页面刷新")
        },
        changeLimit(){
           //this.unsubcribe(this.trainId)
           this.changed=true
           console.log("切换路由")
           this.$router.replace({path:'/training'})
           
        },
        async unsubcribe(id){
            let res=await unsubscribeTrainApi(id)
            console.log(res)
            return res
        },
         async  getSubscribeTrain(trainId) {
            let res = await getSubscribeTrainApi(trainId)
           // console.log(res)
            let labelList = ['唯一标识：', '训练名称：', '模型选择：', '轮数：', '学习率：', 'BatchSize:', '切片大小：', '是否监督：', '训练用户：', '任务类型：', '输出类型：', '创建时间:']
            let valueList = ['id', 'name', 'method', 'epoch', 'learningRate', 'batchSize', 'second', 'isSupervised', 'username', 'taskTypeName', 'outputTypeName', 'createDate']
                for(let i = 0; i < labelList.length; i++) {
                    if(valueList[i] === 'isSupervised') {
                        if(res.data[valueList[i]] === 1) {
                            res.data[valueList[i]] = '是'
                        } else {
                            res.data[valueList[i]] = '否'
                        }
                    } 
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
li{
    list-style: none;
    margin-bottom: 10px;
}
</style>