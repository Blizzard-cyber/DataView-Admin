
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>训练任务</BreadcrumbItem>
        </Breadcrumb>
        <Table border :columns="columns" :data="showData"></Table>
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
import { getTrainListApi } from "../../network/api/trainApi"
export default {
        data () {
            return {
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
                        title: '批大小',
                        key: 'batchSize',
                        width: 100,
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
                        key: 'uid',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '任务类型',
                        key: 'taskTid',
                        width: 100,
                        align: 'center',
                        
                    },
                    {
                        title: '输出类型',
                        key: 'outputTid',
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
                                            this.showEditModal(userData)
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
            async getUserList() {
                let res = await getTrainListApi()
                if(res.type === 'success'){
                    this.userList = res.data
                }
                else{
                    this.$Message.error('获取训练任务失败');
                }
            },
            //切换页码
            changePage(num) {
                this.currentPage = num -1;
            },
            //切换页数
            changePageSize(num) {
                this.currentPageSize = num;
            },
        }
    }
</script>
<style>
    .ivu-table-overflowX{ overflow-x: auto;}
    
    .rowbox{
        margin-bottom: 25px;
        margin-top: 25px;
        margin-left: 10px;
    }
</style>