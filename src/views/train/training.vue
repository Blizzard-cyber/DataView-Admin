
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>训练任务</BreadcrumbItem>
        </Breadcrumb>
        <div>
            <Table border :columns="columns" :data="showData"></Table>
            <Spin size="large" fix v-if="isLoading"></Spin>
        </div>
        <!-- <Table border :columns="columns" :data="showData"></Table> -->
        <Page
            class="flex j-center"
            style="marginTop:20px"
            :total="userList.length"
            show-sizer
            show-elevator
            show-total
            :page-size-opts="[5,10,25,50,100]"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
        />
    </div>
</template>

<script>
import { getUserTrainListDetailApi, getTrainListDetailApi } from "../../network/api/trainApi"
import {mapState} from 'vuex'
export default {
        data () {
            return {
                isLoading:false,
                columns: [
                    {
                        title: '唯一标识',
                        width: 180,
                        align: 'center',
                        key: 'id',
                        fixed: 'left'
                    },
                    {
                        title: '训练名称',
                        key: 'name',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '模型选择',
                        key: 'method',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '轮数',
                        key: 'epoch',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '学习率',
                        key: 'learningRate',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: 'BatchSize',
                        key: 'batchSize',
                        width: 110,
                        align: 'center',
                        
                    },
                    {
                        title: '切片大小',
                        key: 'second',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '是否监督',
                        key: 'isSupervised',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '用户',
                        key: 'username',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '任务类型',
                        key: 'taskTypeName',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '输出类型',
                        key: 'outputTypeName',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight:"10px"
                                    },
                                    on: {
                                        click: () => {
                                            const userData = params.row
                                            this.handleclick(userData.id)
                                        }
                                    }
                                }, '查看详情'),
                            ]);
                        }
                    }
                ],
                userList:[],
                currentPage: 0,
                currentPageSize: 10,
            }
        },
        computed: {
            ...mapState(["uid","auth"]),
            showData() {
                //再截取数据分页展示
                const startIndex = this.currentPage * this.currentPageSize;
                const endIndex = startIndex + this.currentPageSize;
                return this.userList.slice(startIndex, endIndex);
            },
        },
        created () {
            this.getUserList()
        },
        methods: {
            transformTimestamp(timestamp){
                let a = new Date(timestamp).getTime();
                const date = new Date(a);
                const Y = date.getFullYear() + '-';
                const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
                const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
                const m = (date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
                const s = date.getSeconds() <10 ? '0'+date.getSeconds() : date.getSeconds(); 
                const dateString = Y + M + D + h + m + s;
                return dateString;
            },
            async getUserList() {
                this.isLoading = true
                let res
                if(this.auth == 1){
                    res = await getTrainListDetailApi()
                } else {
                    res = await getUserTrainListDetailApi(this.uid)
                }
                if(res.type === 'success'){
                    this.userList = res.data
                    this.userList.forEach(element => {
                        element.createDate = this.transformTimestamp(element.createDate)
                        element.isSupervised = element.isSupervised == 1 ? "是" : "否"
                    })
                } else {
                    this.$Message.error('获取训练任务失败');
                }
                this.isLoading = false
            },
            //切换页码
            changePage(num) {
                this.currentPage = num -1;
            },
            //切换页数
            changePageSize(num) {
                this.currentPageSize = num;
            },
            handleclick(id){
                this.$router.push(`/trainLog/${id}`)
            }
        }
    }
</script>
<style>
    /* .ivu-table-overflowX{ overflow-x: auto;} */
    .ivu-table-overflowX {
        overflow-x: scroll;
    }
    
    .rowbox{
        margin-bottom: 25px;
        margin-top: 25px;
        margin-left: 10px;
    }
    .demo-spin-container{
        position: relative;
    }
</style>