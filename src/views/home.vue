
<template>
    <div class='chart-box'>
        <chartLine :chart-data='lineData' height="500px"></chartLine>
     
        <!-- <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>工作平台</BreadcrumbItem>
            
        </Breadcrumb>
        <Row type="flex" justify="space-between">
            <Col span="4"> 
                <mycard icon="md-person-add" title="新增用户" bgcolor="#2d8cf0" count="803"></mycard>
            </Col>
            <Col span="4"> 
               <mycard icon="ios-disc" title="累计点击" bgcolor="#19be6b" count="232"></mycard>
            </Col>
            <Col span="4"> 
                <mycard icon="md-help" title="新增问答" bgcolor="#ff9900" count="142"></mycard>
            </Col>
            <Col span="4"> 
                 <mycard icon="md-share" title="分享统计" bgcolor="#ed3f14" count="657"></mycard>
            </Col>
            <Col span="4"> 
               <mycard icon="md-chatbubbles" title="新增互动" bgcolor="#e46cbb" count="12"></mycard>
            </Col> -->
            <!-- <Col span="3"> 
                <mycard icon="md-add-circle" title="新增页面" bgcolor="#9a66e4" count="14"></mycard>
            </Col> -->
        <!-- </Row> -->
        <!-- <Row type="flex" justify="space-between" style="margin-top:20px">
            <Col span="7">
                  <Card :padding="0">
                    <charts-line id="line"></charts-line>
                </Card>
            </Col>
            <Col span="7">
                  <Card :padding="0">
                    <charts-line id="line"></charts-line>
                </Card>
            </Col>
            <Col span="7">
                  <Card :padding="0">
                    <charts-line id="line"></charts-line>
                </Card>
            </Col>
           
        </Row> -->
        <!-- <Row style="margin-top:20px">
           <Col span="24">
                <Card :padding="0">
                    <charts-line id="line"></charts-line>
                </Card>
            </Col>
        </Row> -->
    </div>
</template>

<script>
import * as d3 from 'd3'
import{getModelFileApi} from '../network/api/trainApi'
import chartLine from '@/components/line.vue'
import eline from '@/components/echarts/line.vue'
// import mycard from '@/components/mycard'
// import column from '@/components/charts/column'
// import line from '@/components/charts/line'
// import pie from '@/components/charts/pie'
 
export default {
    components: {
        chartLine,
        
       
    },
    data() {
        return {  
            lineData:{
               xData: [],
                color: ["#038BFF"],
                data: [
                {
                    // title: "告警",
                    data: [],
                },
                
                ],
                },
            qylist: {
                title: ["学生端"],
				color: ["#66e783"],
				date: [],
				data: []
            },
            fileName:'pro_2_1684169344002.csv'

        }
    },
    created() {
        this.getModelFile()

    },
    mounted() {
    },
    methods: {
        
        async getModelFile(){
            let res = await getModelFileApi(this.fileName)
           const data = d3.csvParse(res)
           //console.log(data)
           for(let i=0;i<data.length;i++){
            //this.getData(data[i].timestamp)
            this.lineData.xData.push(this.getData(data[i].timestamp))
            this.lineData.data[0].data.push(data[i].ecg)
            //    this.qylist.date.push(data[i].timestamp)
            //     this.qylist.data.push(data[i].ecg)
           }
        },
        //时间戳转换

         getData(timestamp){
           
            var date = new Date(Number(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());

            let strDate = Y+M+D+h+m+s;
            //console.log(strDate) //2020-05-08 17:44:56　
            return strDate;
           
            //console.log(n.toTimeString())
            }
    }
}
</script>
<style scoped>

</style>