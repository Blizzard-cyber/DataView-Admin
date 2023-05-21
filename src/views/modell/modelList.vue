
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型管理</BreadcrumbItem>
            <BreadcrumbItem>模型列表</BreadcrumbItem>
        </Breadcrumb>
        <Row class="rowbox" :gutter="16">
            <Col span="5" >
                <Input v-model="searchOption.value1" placeholder="模型名称" clearable/>
            </Col>
            <Col span="5" >
               <Select v-model="searchOption.value2" clearable placeholder="适用对象" @on-change="selectClear('value2')">
                    <Option v-for="(item,index) in objectoption" :value="item.id" :key="index">{{ item.username }}</Option>
                </Select>
            </Col>
            <Col span="5">
                <Select v-model="searchOption.value3" clearable placeholder="模型功能" @on-change="selectClear('value3')">
                    <Option v-for="(item,index) in funcoption" :value="item.id" :key="index">{{ item.func }}</Option>
                </Select>
            </col>
            <Col span="5">
                <DatePicker v-model="searchOption.value4" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="更新日期" show-week-numbers/>
            </Col>
            <Col span="4" style="padding: 0%;">
                <Button  @click="searchItem" style="margin-right:15px">查询</Button>
                <Button v-if="this.auth==1" type="primary" to="/modelAdd">新增</Button>
            </Col>
        </Row>
        <div>
            <Table border :columns="columns6" :data="showData"></Table>
            <Spin size="large" fix v-if="isLoading"></Spin>
        </div>
        <Page
            class="flex j-center"
            style="marginTop:20px"
            :total="userList.length"
            :current="this.currentPage"
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
import { getUsersApi } from "../../network/api/userApi"
import { getModelListApi,getTaskTypeApi,searchModelApi,deleteModelApi,getFileNameApi,downloadModelApi,getModelListForUserApi} from "../../network/api/modelApi";
export default {
        data () {
            return {
                isLoading: false,
                searchOption: {
                    value1: '',
                    value2: '',
                    value3: '',
                    value4: '',
                },
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
                        title: '模型名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '适用对象',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '功能',
                        key: 'taskTypeName',
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
                currentPage: 1,
                currentPageSize: 10,
            }
        },
        computed: {
            ...mapState(["token","uid","auth"]),
            showData() {
                //再截取数据分页展示
                const startIndex = (this.currentPage - 1) * this.currentPageSize;
                const endIndex = startIndex + this.currentPageSize;
                return this.userList.slice(startIndex, endIndex);
            },
            searchDate() {
                let str = "";
                if (this.searchOption.value4 !== "") {
                    // Convert time string to Date object
                    let date = new Date(this.searchOption.value4);
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
                // 权限管理
                let res1 = await getModelListForUserApi(this.uid)
                let res2 = await getModelListApi()
                let res
                if (this.auth == 1) res = res2
                else res = res1
                    if(res.type === 'success'){
                        this.userList = res.data
                        this.userList.forEach(element => {
                            element.updateDate = this.transformTimestamp(element.updateDate)
                        })
                    }
                    else{
                        this.$Message.error('获取选项列表失败');
                    }
                //任务类型选项
                let taskList = await getTaskTypeApi()
                    if(taskList.type === 'success'){
                        this.funcoption = taskList.data  
                    }
                    else{
                        this.$Message.error('获取任务类型失败');
                    }

                //适用对象选项
                let userlist = await getUsersApi()
                    if(userlist.type === 'success'){
                        this.objectoption = userlist.data
                        if(this.auth == 0){
                            this.objectoption = this.objectoption.filter((item)=>{return item.id == this.uid})
                        }
                    }
                    else{
                        this.$Message.error('获取适用对象列表失败');
                    } 
                
                if(this.auth == 0){
                    //admin初始数据的接口是详细数据，user初始数据的接口是简单数据，需要通过id得到对应的文字信息
                    this.userList.forEach(element => {
                        this.objectoption.forEach(user => {
                            if(element.uid === user.id){
                                this.$set(element,"username",user.username)
                            }
                        })
                        this.funcoption.forEach(task => {
                            if(element.taskTid === task.id){
                                this.$set(element,"taskTypeName",task.func)
                            }
                        })
                    }); 
                }
                this.isLoading = false
            },
            //将表中数据选项转换为数组
            // getOptionList(op) {
            //     //将userList中的username项的值提取出来放入数组
            //     let arr = []
            //     for(let i=0;i<this.userList.length;i++){
                    
            //         arr.push(this.userList[i][op])
            //     }
            //     //去重
                
            //     let set = new Set(arr)
            //     let arr2 = Array.from(set)
            //     //将数组转换为对象数组
            //     let arr3 = []
            //     for(let i=0;i<arr2.length;i++){
            //         arr3.push({value:arr2[i],label:arr2[i]})
            //     }
            //     //将对象数组赋值给过去
            //     if(op === "username"){
            //         this.objectoption = arr3
            //         //console.log(this.objectoption)
            //     }
            //     else if(op === "taskTypeName"){
            //         this.funcoption = arr3
            //         //console.log(this.funcoption)
            //     }
            // },
            //切换页码
            changePage(num) {
                this.currentPage = num;
            },
            //切换页数
            changePageSize(num) {
                this.currentPageSize = num;
            },
            //解决select组件清空后参数值变成undefined的问题，避免搜索参数出错
            selectClear(key) {
                if(this.searchOption[key] == undefined){
                    this.searchOption[key] = ''
                }
            },
            async downloadModal(id) {
                //this.$axios.get()
                //window.open("http://43.248.188.73:11234/model/download/"+id)
                 let res = await downloadModelApi(id)
                 //console.log(res)
                
                 //将返回的bolob对象转换为文件对象实现下载
                    let blob = new Blob([res.data],{type:'application/octet-stream'})
                    let filename=res.headers['filename']
                    let downloadElement = document.createElement('a')
                    let href = window.URL.createObjectURL(blob)
                    downloadElement.setAttribute('href',href)
                    downloadElement.setAttribute('download',filename)
                    downloadElement.click()
                    window.URL.revokeObjectURL(href)
            },
            async remove (index,row) {  
                this.isLoading = true
                if(this.auth == 1){
                    let res = await deleteModelApi(index)
                    if(res.type === 'success'){
                        //删除的是当前页剩余的最后一条数据时，跳转到上一页
                        let cur = (this.currentPage - 1) * this.currentPageSize + row
                        if(row === 0 && (cur === this.userList.length - 1) && this.currentPage !== 1){
                            this.currentPage = this.currentPage - 1
                        }
                        this.userList.splice(cur, 1)
                        this.$Message.success('删除成功');
                        // this.userList.splice(row, 1); //删除非第一页数据时索引不对
                        // this.getUserList() //删除的是当前页剩余的最后一条数据时，显示会有问题
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                } else {
                    this.$Message.error('没有权限');
                }
                this.isLoading = false
            },
            async searchItem() {
                this.isLoading = true
                if (this.auth == 0){
                    this.searchOption.value2 = this.uid
                }
                let data = {
                    modelName: this.searchOption.value1,
                    userId: this.searchOption.value2,
                    taskTypeId: this.searchOption.value3,
                    updateDate: this.searchDate
                }
                let res= await searchModelApi(data)
                if (res.type === "success"){
                    if(res.data.length===0){
                        this.$Message.error('没有找到匹配的结果');
                    }
                    else
                        this.$Message.success('查找成功');
                    this.userList = res.data  
                    //对搜索返回的数据id处理成对应的文字描述
                    this.userList.forEach(element => {
                        this.objectoption.forEach(user => {
                            if(element.uid === user.id){
                                this.$set(element,"username",user.username)
                            }
                        })
                        this.funcoption.forEach(task => {
                            if(element.taskTid === task.id){
                                this.$set(element,"taskTypeName",task.func)
                            }
                        })
                    }); 
                    this.currentPage = 1 // 查询后跳转至第一页
                } else {
                    this.$Message.error(res.message);
                }
                this.isLoading = false
            }
            
        }
    }
</script>
<style>
    .ivu-table-overflowX{ overflow-x: hidden;}
    .ivu-table-wrapper-with-border{
        border: 3px solid #dcdee2;
    }
    .rowbox{
        margin-bottom: 25px;
        margin-top: 25px;
        margin-left: 10px;
    }
</style>