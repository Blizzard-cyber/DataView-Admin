<template>
  <Pline :pdata="pdata" :label="label"></Pline>
</template>

<script>
import Pline from '@/components/Pline.vue'
import { EventSourcePolyfill } from 'event-source-polyfill';
import util from '@/util'
export default {
  components: {
    Pline
  },
  data() {
    return {
      pdata: {
        time: ['1', '2', '3', '4', '5'],
        dataOne: [2, 4, 6, 8, 10,12]
      },
      label: '测试'
    }
  },
  created() {
     this.subscribe()
  //    setInterval(() => {
  //     this.pdata.time.shift();
  //     this.pdata.time.push(new Date().toLocaleTimeString().replace(/^\D*/, ''));
  //     this.pdata.dataOne.shift();
  //     this.pdata.dataOne.push(1);
  //     //console.log(this.pdata.time)
  // },2000)
  },
  methods: {
     subscribe() {
            let token=util.storage.get('token')
            //console.log(token)
            let that=this
            const baseUrl='http://43.248.188.73:11234/train/subscribe/'
            if(typeof(EventSource) !== "undefined") {  //判断浏览器是否支持EventSource
                const source = new EventSourcePolyfill(baseUrl + '856942020072181760',{
                    headers:{
                        'Auth':token
                    }
                });
                source.onopen = function(event) {
                    console.log("连接打开");
                };
                source.onmessage = function(event) {
                    //console.log(JSON.parse(event.data));
                    that.handleLog(JSON.parse(event.data))
                    if(event.data==="finish"){
                        //let res=that.unsubcribe(that.trainId)
                        //console.log(res)
                         source.close()
                         console.log("连接关闭")
                        that.$Message.success("训练结束!")    
                    }
                    else if(this.changed){
                        this.unsubcribe(this.trainId)
                        source.close()
                        console.log("连接关闭")
                    }
                };
                source.onerror = function(event) {
                    console.log("连接发生错误");

                };
            } else {
                console.log("当前浏览器不支持使用EventSource接收服务器推送事件!");
            }
            
        },
         handleLog(eventLog){
          //获取当前时间hh:mm:ss
          let time = new Date().toLocaleTimeString().replace(/^\D*/, '');
          if(this.pdata.time.length>10){
            this.pdata.time.shift();
            this.pdata.time.push(time);
            this.pdata.dataOne.shift();
            this.pdata.dataOne.push(eventLog.loss);
          }
        },
  }
}
</script>

<style>

</style>