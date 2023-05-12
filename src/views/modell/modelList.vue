
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型管理</BreadcrumbItem>
            <BreadcrumbItem>模型列表</BreadcrumbItem>
        </Breadcrumb>
        <Row class="rowbox" :gutter="16">
            <Col span="5" >
                <Input v-model="value1" placeholder="唯一标识" clearable/>
            </Col>
            <Col span="5" >
               <Select v-model="value2" clearable placeholder="适用对象">
                    <Option v-for="item in objectoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="5">
                <Select v-model="value3" clearable placeholder="模型功能">
                    <Option v-for="item in funcoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </col>
            <Col span="5">
                <!-- <Input v-model="value4" placeholder="更新日期" clearable style="width: 200px" /> -->
                <DatePicker v-model="value4" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="更新日期" show-week-numbers/>
            </Col>
            <Col span="4" style="padding: 0%;">
                <Button  @click="searchItem" style="margin-right:15px">查询</Button>
                <Button v-if="this.auth==1" type="primary" to="/modelAdd">新增</Button>
            </Col>
        </Row>
        <Table border :columns="columns6" :data="showData"></Table>
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
        <!-- <Modal 
            v-model="isModal"
            :styles="{top:'60px'}" >
            <p slot="header" style="font-size:16px">
                <span>修改用户</span>
            </p>
            <Form label-position="left"  :label-width="100">
                <FormItem 
                    :label="item.label"
                    v-for="item of modalItem" 
                    v-if="!item.hide"
                    :key="item.label">
                    <Input 
                        :type="item.type || 'text'" 
                        v-model="item.value" 
                        style="width:300px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <slot name="footer">
                    <Button type="text" size="large" @click="cancel">取消</Button>
                    <Button type="primary" size="large" @click="clickModalEvent">提交</Button>
                </slot>
            </div>
        </Modal> -->
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getModelListApi,searchModelApi,deleteModelApi,getFileNameApi,downloadModelApi,getModelListForUserApi} from "../../network/api/modelApi";
export default {
        data () {
            return {
                value1: '',
                value2: '',
                value3: '',
                value4: '',

                objectoption: [],
                funcoption:[],
                columns6: [
                    {
                        title: '序号',
                        width: 90,
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '唯一标识',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '适用对象',
                        key: 'uid',
                        align: 'center'
                    },
                    {
                        title: '功能',
                        key: 'taskTid',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '更新时间',
                        key: 'updateDate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
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
                                            
                                            this.downloadModal(params.row.id)
                                        }
                                    }
                                }, '下载'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click:() => {
                                            this.$Modal.confirm({
                                                title: '系统提示',
                                                content: '删除后无法恢复，确定删除吗？',
                                                onOk: () => {
                                                    
                                                    this.remove(params.row.id,params.index);
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                userList:[],
               
                // userData: {}
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
            searchDate() {
                let str = "";
                if (this.value4 !== "") {
                    // Convert time string to Date object
                    let date = new Date(this.value4);
                    // Extract year, month, and day
                    let year = date.getFullYear();
                    let month = ("0" + (date.getMonth() + 1)).slice(-2);
                    let day = ("0" + date.getDate()).slice(-2);
                    // Extract hours, minutes, and seconds
                    let hours = ("0" + date.getHours()).slice(-2);
                    let minutes = ("0" + date.getMinutes()).slice(-2);
                    let seconds = ("0" + date.getSeconds()).slice(-2);
                    // Format string as "yyyy-MM-dd HH:mm:ss"
                    str = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                }
                return str;
            }
        },
        created () {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                let res1 = await getModelListForUserApi(this.uid)
                let res2 = await getModelListApi()
                let res
                if (this.auth == 1) res = res2
                else res = res1
                if(res.type === 'success'){
                    this.userList = res.data
                    let op1="uid"
                    let op2="taskTid"
                    this.getOptionList(op1);
                    this.getOptionList(op2);
                }
                else{
                    this.$Message.error('获取选项列表失败');
                }
                
            },
            //将表中数据选项转换为数组
            getOptionList(op) {
                //将userList中的uid项的值提取出来放入数组
                let arr = []
                for(let i=0;i<this.userList.length;i++){
                    
                    arr.push(this.userList[i][op])
                }
                //去重
                
                let set = new Set(arr)
                let arr2 = Array.from(set)
                //将数组转换为对象数组
                let arr3 = []
                for(let i=0;i<arr2.length;i++){
                    arr3.push({value:arr2[i],label:arr2[i]})
                }
                //将对象数组赋值给过去
                if(op === "uid"){
                    this.objectoption = arr3
                    //console.log(this.objectoption)
                }
                else if(op === "taskTid"){
                    this.funcoption = arr3
                    //console.log(this.funcoption)
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
            downloadModal(id) {
                window.open("http://43.248.188.73:11234/model/download/"+id)
                
                        // let blob = new Blob([res.data], {type: 'application/octet-stream'})
                        // let fileName= "test.png"
                        // //let fileName = res.headers['content-disposition'].split(';')[1].split('=')[1]
                        // fileName = decodeURI(fileName)
                        // let url = window.URL.createObjectURL(blob)
                        // let link = document.createElement('a')
                        // link.style.display = 'none'
                        // link.href = url
                        // link.setAttribute('download', fileName)
                        // document.body.appendChild(link)
                        // link.click()              
            },
            
            
            async remove (index,row) {   
                //console.log(index)
                if(this.auth == 1){
                    let res = await deleteModelApi(index)
                    if(res.type === 'success'){
                        this.$Message.success('删除成功');
                        this.userList.splice(row, 1);
                    }
                    else{
                        this.$Message.error('删除失败');
                    }
                } else {
                    this.$Message.error('没有权限');
                }
                
                
                
            },
           async searchItem() {
             if(this.value1){
                let data = {
                    modelName: this.value1,
                    userId: this.value2,
                    taskTypeId: this.value3,
                    updateDate: this.searchDate
                }
                let res= await searchModelApi(data)
                    if(res.data.length===0){
                        this.$Message.error(res.error.message);
                    }
                    else
                        this.$Message.success('查找成功');
                    this.userList = res.data   
            }
             else{
                this.$Message.error("请传入模型唯一标识！")
            }
            }
            
        }
    }
</script>
<style>
    .ivu-table-overflowX{ overflow-x: hidden;}
    
    .rowbox{
        margin-bottom: 25px;
        margin-top: 25px;
        margin-left: 10px;
    }
</style>