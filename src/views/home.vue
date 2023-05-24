
<template>
    <div class="workplace-page flexC">
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>工作平台</BreadcrumbItem>       
        </Breadcrumb>
        <div class="head flexC">
            <div class="flexR">
                <div class="left flexR">
                    <div>
                       <Avatar style="color: #f56a00;background-color: #fde3cf" size="70">{{UserName}}</Avatar>
                    </div>
                    <div class="flexC">
                        <span>您好，{{UserName}}，欢迎您登录管理平台！</span>
                        <span style="font-weight: bold;"> <Icon type="ios-time" />当前时间为：{{nowTime}}</span>
                    </div>
                    
                </div>
                <div class="right flexC">
                </div>
            </div>
        </div>

        <div class="content flexR">
            <div class="left flexC">
                <!--项目-->
              
                <div class="item flexC">
                    <div class="title flexR">
                        <div class="left flexR">
                            <Avatar icon="md-apps" style="color: rgb(24, 144, 255); background-color: rgb(230, 247, 255);" size="small"/>
                            <span>数据概况</span>
                        </div>
                       
                    </div>
                    <div class="body flexR">
                        <div class="flexC" v-for="(item,index) in myProjectData" :key="index" >
                            <div class="bg flexC" >
                                <div class="flexC">
                                    <span>{{item.name}}</span>
                                    <span>{{item.number}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
            <div class="right flexC">
                <div class="item flexC">
                    <div class="title flexR">
                        <div class="left flexR">
                            <Avatar icon="md-heart" style="color: rgb(255, 77, 79); background-color: rgb(255, 241, 240);" size="small"/>
                            <span>快捷跳转</span>
                        </div>
                        <!-- <div class="right flexR">
                            <Tooltip content="配置" placement="top">
                                <Icon class="pointer" type="md-settings"/>
                            </Tooltip>
                        </div> -->
                    </div>
                    <div class="body flexR">
                        <div class="pointer flexC" @click="jumpTo('/modelList')">
                           
                            <Icon type="md-speedometer" style="font-size: 24px; color: rgb(82, 196, 26);"/>
                            <span>模型列表</span>
                        </div>
                        <div class="pointer flexC" @click="jumpTo('/modelAdd')">
                            <Icon type="ios-list-box-outline" style="font-size: 24px; color: rgb(24, 144, 255);"/>
                            <span>模型添加</span>
                        </div>
                        <div class="pointer flexC">
                            <!-- <Icon type="ios-paper-outline" style="font-size: 24px; color: rgb(250, 173, 20);"/>
                            <span>列表</span> -->
                        </div>
                        <Divider style="width: 90%; min-width: 90%;margin: 16px auto;"/>
                        <div class="pointer flexC" @click="jumpTo('/deviceList')">
                            <Icon type="ios-search" style="font-size: 24px; color: rgb(114, 46, 209);"/>
                            <span>设备列表</span>
                        </div>
                        <div class="pointer flexC" @click="jumpTo('/deviceAdd')">
                            <Icon type="md-settings" style="font-size: 24px; color: rgb(19, 194, 194);"/>
                            <span>设备添加</span>
                        </div>
                        <div class="pointer flexC">
                            <!-- <Icon type="ios-briefcase-outline" style="font-size: 24px; color: rgb(235, 47, 150);"/>
                            <span>工具</span> -->
                        </div>
                        <Divider style="width: 90%; min-width: 90%;margin: 16px auto;"/>
                        <div class="pointer flexC" @click="jumpTo('/trainList')">
                            <Icon type="ios-body" style="font-size: 24px; color: rgb(114, 46, 209);"/>
                            <span>训练数据集</span>
                        </div>
                        <div class="pointer flexC" @click="jumpTo('/trainModel')">
                            <Icon type="logo-rss" style="font-size: 24px; color: rgb(19, 194, 194);"/>
                            <span>模型训练</span>
                        </div>
                        <div class="pointer flexC" @click="jumpTo('/training')">
                            <Icon type="ios-pulse" style="font-size: 24px; color: rgb(235, 47, 150);"/>
                            <span>训练任务</span>
                        </div>
                    </div>

                    <Divider style="width: 90%; min-width: 90%;margin: 16px auto;"/>
<!-- 
                    <div class="options flexR">
                        <span>操作一</span>
                        <span>操作一</span>
                        <span>
                            <Button icon="md-add" size="small" class="optionsBtn">添加</Button>
                        </span>
                    </div> -->
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters,mapState} from 'vuex'
import {getHomeDataApi} from '@/network/api/homeApi.js'
    export default {
        name: "workplace",
        data() {
            return {
                nowTime:new Date(),
                avatarImg: 'https://githup.zengxiaohui.com/vueImg/avatar1.jpg',
                myProjectData: [
                    {
                        name:'模型总数',
                        number:0,
                        
                   }, 
                     {
                         name:'设备总数',
                        number:0,
                     },
                     {
                        name:'数据集总数',
                        number:0,
                     },
                     {
                        name:'训练任务数',
                        number:0,
                     },
                     {
                        name:'班组总数',
                        number:0,
                     },
                     {
                        name:'用户总数',
                        number:0,
                     },
                    
                ], 
            }
        },
        // 挂载时间
        mounted () {
            let that = this
            this.timer = setInterval(function () {
            that.nowTime = new Date().toLocaleString()
            })
        },
        // 销毁时清除计时器
        beforeDestroy: function () {
            if (this.timer) {
            clearInterval(this.timer)
            }
        },
        created() {
            this.getData()
        },
        computed:{
            ...mapGetters(["UserName"]),
            ...mapState(["uid"])
        },
        
        methods: {
           async getData(){
            let res = await getHomeDataApi(this.uid)
            //console.log(res.data)
            let mapdata=['model','device','sigFile','train','group','user']
            for(let i=0;i<mapdata.length;i++){
                this.myProjectData[i].number=res.data[mapdata[i]]
            }
            //console.log(this.myProjectData)
            },
            jumpTo(url){
                this.$router.push(url)
            }
        },
        watch: {},
        filters: {}
    }
</script>

<style lang="less">
    @import "../assets/css/workplace.less";
</style>
