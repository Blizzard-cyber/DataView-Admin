<template>
<div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>展示班组</BreadcrumbItem>     
    </Breadcrumb>
    <Table 
        border
        ref="selection"
        max-height="700" 
        width="1200"
        style=" margin-left:auto; margin-right:auto"
        :columns="columns" 
        :data="classdata"
        @on-selection-change="handleSelectionChange"
        ></Table>
    <Row style="margin-top:30px">
          <Col span="5" offset="8">
            <DatePicker  v-model="pickDate" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
          </Col>
          <Col span="5" >
            <Button type="primary" @click="handleclick">大屏展示</Button>
          </Col>
    </Row>
</div>
</template>
<script>
    import {getClassApi,getClassByDateApi} from "../../network/api/dataApi"
    import expandRow from './subtable.vue';
    import { mapMutations } from 'vuex';
    export default {
        //components: { expandRow },
        data () {
            return {
                pickDate:'',
                paramGroup:'',
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
                classdata: []
            }
            
        },
        computed:{
            
        },
        created(){
                this.getList();
            },
        methods:{
            ...mapMutations(['setParamGroup','setPickDate']),

           async getList(){
                let res = await getClassApi();
                //console.log(res.data.length)
                for(let i=0;i<res.data.length;i++){
                    let classmates=[];
                    classmates.push({
                        name:res.data[i].leader.name,
                        attr:"组长"
                    })
                    for(let j=0;j<res.data[i].member.length;j++){
                        classmates.push({
                            name:res.data[i].member[j].name,
                            attr:"组员"
                        })
                    }
                    this.classdata.push({
                        groupId:res.data[i].groupId,
                        leaderName:res.data[i].leader.name,
                        groupInfo:classmates
                    })
                }
                
            },
            handleSelectionChange(val) {
                this.paramGroup='';
                for(let i=0;i<val.length;i++){
                    this.paramGroup+=val[i].groupId+','
                }
                //去除最后的逗号
                this.paramGroup=this.paramGroup.substring(0,this.paramGroup.length-1);
                //console.log(this.paramGroup)
                
            },
            formatDate(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d + ' '+'00:00:00';
            },
            handleclick(){
             if(this.paramGroup==''){
                 this.$Message.error('请选择班组');
                 return;
             }
            if(this.pickDate==''){
                    this.$Message.error('请选择日期');
                    return;
            }
            this.setParamGroup(this.paramGroup);
            this.setPickDate(this.formatDate(this.pickDate));
            
           
            this.$router.push('./data')
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