<template>
  <div class="iframe_box" >
    <!-- <div
      class="load"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
    ></div> -->
    <iframe
      :src="`dataview/index.html`" 
      frameborder="0"
      scrolling="yes"
      width="100%"
      height="100%"
      ref="iframeDom"
      style="transform: scale(1)"
    ></iframe>
  </div>
</template>

<script>
import {getClassByDateApi} from "../../network/api/dataApi"
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    //...mapState(['pickDate','paramGroup']),
  },
  created() {
  },
  mounted() {
    this.getData();
    //this.iframeLoad();
    // this.$nextTick(() => {
    //   this.$refs.iframeDom.onload = () => {
    //     this.loading = false;
    //   };
    // });
  },
  methods: {
    ...mapGetters(['getpickDate','getparamGroup']),

    async getData() {
	 
      this.loading = true;
      let date=this.getpickDate();
      let paramGroup=this.getparamGroup(); //获取请求参数

      let res=await getClassByDateApi(paramGroup,date);
      //console.log(res.data)
     
     if(res.type === "success"){
        this.$Message.success('数据获取成功');
         if(res.data.length==0){
          this.$Message.error('该班组当天无数据');
         }
         else{
          const processed=this.dataProcess(res.data);  //数据处理
          //console.log(processed)
          this.$refs.iframeDom.contentWindow.postMessage(processed, "*");
         } 
      }
      else{
        this.$Message.error('数据获取失败');
      }
      
      //console.log(res)
      
    },
    dataProcess(res){
    const total=['memberNumOfDet','abnormal']
    let totalNum=this.getLineData(res,total); //总人数

     const barGroup1=['phy','heartRate','bloodOxy','bloodPer','respRate'];
    const barGroup2=['psy','emotion','stress','energy','heart'];
     let leftbar=this.getbBarData(res,barGroup1);  //左边柱状图数据
     let rightbar=this.getbBarData(res,barGroup2); //右边柱状图数据

     const lineGroup1=['heartRate','bloodOxy','bloodPer','respRate'];
     const lineGroup2=['emotion','stress','energy','heart'];
      let leftline=this.getLineData(res,lineGroup1); //左边折线图数据
      let rightline=this.getLineData(res,lineGroup2); //右边折线图数据

     let leftPie=this.getPieDataleft(res);
     const pieGroupright=['normal','phy','psy','psyAndPhy']; //右边饼图数据
     let rightPie=this.getPieDataright(res,pieGroupright); //右边饼图数据

     return [totalNum,leftbar,leftline,leftPie,rightbar,rightline,rightPie]
    },
    getbBarData(wholeData,group){
      let leftbar=[];
      for(let p in wholeData){
        let temp=[];
        if(wholeData[p].memberNumOfDet==0){
          temp=[0,0,0,0,0];
        }
        else{
          for(let i=0;i<group.length;i++){
            temp.push(wholeData[p][group[i]]);
          }
        }
        leftbar.push(temp);
      }
      return leftbar;
    },
    getLineData(wholeData,group){
      let leftline=[];
      for(let i=0;i<group.length;i++){
        let temp=[];
        for(let p in wholeData){
          if(wholeData[p].memberNumOfDet==0){
            temp.push(0);
          }
          else{
            temp.push(wholeData[p][group[i]]);
            }
        }
        leftline.push(temp);
      }
      return leftline;
    },
    getPieDataleft(wholeData){
      let pieData=[];
      for(let p in wholeData){
        let temp=[
          { value: 0, name: "优秀" },
          { value: 0, name: "良好" },
          { value: 0, name: "较差" },
          { value: 0, name: "极差" },
        ];
        if(wholeData[p].memberNumOfDet!==0){  
          for(let i=0;i<temp.length;i++){
            temp[i].value=wholeData[p].comStatus[i];
          }
        }
        pieData.push(temp);
      }
      return pieData;

    },
    getPieDataright(wholeData,group){
      let pieData=[];
      for(let p in wholeData){
        let temp=[
          { value: 0, name: "无异常状态" },
          { value: 0, name: "生理状态异常" },
          { value: 0, name: "心理状态异常" },
          { value: 0, name: "生理、心理状态异常" },
        ];
        if(wholeData[p].memberNumOfDet!==0){  
          for(let i=0;i<group.length;i++){
            temp[i].value=wholeData[p][group[i]];
          }
        }
        pieData.push(temp);
      }
      return pieData
     },

    iframeLoad() {
      this.$refs.iframeDom.onload = () => {
        this.loading = false;
      };
    },

  },
}

</script>
<style>
.iframe_box {
  /* transform: scale(1.0); */
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: hidden;
}
</style>