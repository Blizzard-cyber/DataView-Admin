<template>
<div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>展示班组</BreadcrumbItem>     
    </Breadcrumb>
    <Table 
        border
        max-height="700" 
        width="1200"
        style=" margin-left:auto; margin-right:auto"
        :columns="columns" 
        :data="classdata"
        ></Table>
    <Row style="margin-top:30px">
          <Col span="5" offset="8">
            <DatePicker  v-model="pickData" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
          </Col>
          <Col span="5" >
            <Button type="primary" @click="handleclick">大屏展示</Button>
          </Col>
    </Row>
</div>
</template>
<script>
    import {getClassApi} from "../../network/api/dataApi"
    import expandRow from './subtable.vue';
    export default {
        //components: { expandRow },
        data () {
            return {
                pickData:'',
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row.groupInfo
                                }
                            })
                        }
                    },
                    {
                        title: '班组编号',
                        key: 'groupId',
                        align:"center"
                    },
                    {
                        title: '组长',
                        key: 'leaderName',
                        align:'center'
                    },
                     {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }
                ],
                classdata: [
                    {
                        groupId:'2',
                        leaderName:'test1',
                        groupInfo:[
                            {
                                name:"test1",
                                attr:"组长"
                            },
                            {
                                name:"队员1",
                                attr:"组员"
                            },
                            {
                                name:"队员2",
                                attr:"组员"
                            },
                            {
                                name:"队员3",
                                attr:"组员"
                            },
                        ]
                    }
                ]
            }
            
        },
        created(){
                this.getList();
            },
        methods:{
           async getList(){
                let res = await getClassApi();
                console.log(res.data)
            }
        }
    }
</script>
<style>
    .ivu-table-overflowX{ overflow-x: hidden;} 
    .showimg {
        width: 50px;
        height: 70px;
    }
    
    .right-area {
        flex-direction: column;
    }
    .right-area p {
        margin-top: 25px;
    }
</style>