
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>训练数据集</BreadcrumbItem>
        </Breadcrumb>
        <Row class="rowbox" :gutter="16">
            <Col span="5" >
               <Input v-model="searchOption.value1" placeholder="文件名称" clearable/>
            </Col>
            <Col span="3" >
                <Select v-model="searchOption.value2" clearable placeholder="训练对象" @on-change="selectClear('value2')">
                    <Option v-for="(item,index) in userOption" :value="item.id" :key="index">{{ item.username }}</Option>
                </Select>
            </Col>
            <Col span="3">
                <Select v-model="searchOption.value3" clearable placeholder="任务类型" @on-change="selectClear('value3')">
                    <Option v-for="(item,index) in taskOption" :value="item.id" :key="index">{{ item.func }}</Option>
                </Select>
            </col>
            <Col span="3">
                <Select v-model="searchOption.value4" clearable placeholder="输入类型" @on-change="selectClear('value4')"> 
                    <Option v-for="(item,index) in inputOption" :value="item.id" :key="index">
                        {{ item.name + item.batchSize}}
                    </Option>
                </Select>
            </col>
            <Col span="5">
                <DatePicker v-model="searchOption.value5" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="创建日期" show-week-numbers/>
            </Col>
            <Col span="5">
                <Button @click="searchItem" >查询</Button>
                <Button type="primary" style="margin-left:10px;" @click="isModal=true">新增</Button>
                <Button type="primary" @click="handleclick" style="margin-left:10px;">训练</Button>
            </Col>
        </Row>
        <Modal v-model="isModal" title="新增数据集">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
                <FormItem label="训练对象" prop="uid">
                    <Select v-model="formValidate.uid" placeholder="请选择" style="width:250px">
                        <Option v-for="(item,index) in userOption" :value="item.id" :key="index">{{ item.username }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务类型" prop="taskTid">
                    <Select v-model="formValidate.taskTid" placeholder="请选择" style="width:250px">
                        <Option v-for="(item,index) in taskOption" :value="item.id" :key="index">{{ item.func }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="输入类型" prop="inputTid">
                    <Select v-model="formValidate.inputTid" placeholder="请选择" style="width:250px">
                        <Option v-for="(item,index) in inputOption" :value="item.id" :key="index">
                            {{ item.name + item.batchSize}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="标签类型" prop="label">
                    <Input v-model="formValidate.label" placeholder="" style="width:250px"></Input>
                </FormItem>
                <FormItem label="信号文件" prop="sigFile">
                    <Upload 
                        ref="upload"
                        action=""
                        :before-upload="handleBeforeUpload"
                        :format="['csv']"
                        :on-format-error="handleFormatError"
                        >
                        <Button icon="ios-cloud-upload-outline">读取文件</Button>
                    </Upload>
                    <div v-if="formValidate.sigFile!== null">
                        {{ formValidate.sigFile.name }} 
                    </div>
                </FormItem>
            </Form>
            <div slot="footer">
                <slot name="footer">
                    <Button type="text" @click="handleCancel('formValidate')">取消</Button>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                </slot>
            </div>
        </Modal>
        <div>
            <Table max-height="600" border :columns="columns" :data="userList" @on-selection-change="handleSelectionChange"></Table>
            <Spin size="large" fix v-if="isLoading"></Spin>
        </div>
        <Modal v-model="isModalPreview" fullscreen title="数据集预览">
            <p slot="header" style="text-align:center">
                <Icon type="ios-analytics-outline"></Icon>
                <span>{{previewFileName}}</span>
            </p>
            <div class="line-box">
                <chartLine :chartData='lineData' width="1550px" height="550px"></chartLine>
            </div>
            <div slot="footer">
                <slot name="footer">
                    <Button type="success" @click="isModalPreview=false">关闭</Button>
                    
                </slot>
            </div>
            <Spin size="large" fix v-if="isLoading2"></Spin>
        </Modal>
    </div>
</template>

<script>
import chartLine from '../../components/line.vue'
import * as d3 from 'd3'
import { mapState, mapMutations } from 'vuex';
import { getTaskTypeApi,getINModelApi } from '../../network/api/modelApi'
import { getUsersApi } from '../../network/api/userApi'
import { getFileListApi, getFileListDetailApi, searchFileApi, addFileApi, deleteFileApi, downLoadSigFileApi,getModelFileApi,getUserFileApi } from "../../network/api/trainApi"
export default {
    components: {
        chartLine
    },
        data () {
            return {
                isModal: false,
                isModalPreview: false,
                isLoading:false,
                isLoading2:false,
                previewFileName:'',
                lineData:{
                    xData: [],  //x轴数据
                    color: ["#038BFF"],
                    data: [
                    {data: [],},  //y轴数据
                    
                    ]},
                formValidate: {
                    uid: '',
                    taskTid: '',
                    inputTid: '',
                    label: '',
                    sigFile: '',
                },
                searchOption: {
                    value1: '',
                    value2: '',
                    value3: '',
                    value4: '',
                    value5: '',
                },
                userOption:[],
                taskOption:[],
                inputOption:[],
                labelOption:[
                    {
                        value:0,
                        label:0,
                    },
                    {
                        value:1,
                        label:1,
                    },
                    {
                        value:2,
                        label:2,
                    },
                    {
                        value:3,
                        label:3,
                    },
                    
                ],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        width: 70,
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        key: 'fname',
                        align: 'center'
                    },
                    {
                        title: '训练对象',
                        width: 100,
                        key: 'username',
                        align: 'center'
                    },
                     {
                        title: '任务类型',
                        width: 100,
                        key: 'taskTypeName',
                        align: 'center'
                    },
                    {
                        title: '输入类型名称',
                        width: 100,
                        key: 'inputTypeName',
                        align: 'center'
                    },
                    {
                        title: 'BatchSize',
                        width: 110,
                        key: 'inputBatchSize',
                        align: 'center'
                    },
                    {
                        title: '标签',
                        width: 70,
                        key: 'label',
                        align: 'center'
                    },
                   
                    {
                        title: '更新时间',
                        key: 'uploadDate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight:"5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.previewFile(params.row.fname)
                                        }
                                    }
                                }, '预览'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight:"5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.downloadFile(params.row.id)
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
                ruleValidate: { //数据集添加表单校验规则
                    uid: [
                        { required: true, message:'请选择训练对象', trigger: 'change', type: 'number'}
                    ],
                    taskTid: [
                        { required: true, message:'请选择任务类型', trigger: 'change', type: 'number'}
                    ],
                    inputTid: [
                        { required: true, message:'请选择输入类型', trigger: 'change', type: 'number'}
                    ],
                    label: [
                        { required: true, message:'请输入标签类型', trigger: 'blur'},
                        { type: 'number',min:0,max:100, message:'请输入正确的标签类型', trigger: 'blur',transform: (value) => Number(value)}
                    ]
                },
                trainInfo:[],
            }
        },
        
        computed: {
            ...mapState(["uid","auth"]),
            searchDate() {
                //时间选择器Date->str
                let str = ''
                if (this.searchOption.value5 !== "") {
                    let date = new Date(this.searchOption.value5);
                    let year = date.getFullYear();
                    let month = ("0" + (date.getMonth() + 1)).slice(-2);
                    let day = ("0" + date.getDate()).slice(-2);
                    let hours = ("0" + date.getHours()).slice(-2);
                    let minutes = ("0" + date.getMinutes()).slice(-2);
                    let seconds = ("0" + date.getSeconds()).slice(-2);
                    // Format string as "yyyy-MM-dd HH:mm:ss"
                    str = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                }
                return str
            },
        },
        created () {
           this.getUserList();
        },
        methods: {
            ...mapMutations(['setTrainInfo']),
            transformTimestamp(timestamp){
                //let a = new Date(timestamp).getTime();
                const date = new Date(timestamp);
                const Y = date.getFullYear() + '-';
                const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
                const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
                const m = (date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
                const s = date.getSeconds() <10 ? '0'+date.getSeconds() : date.getSeconds(); 
                const dateString = Y + M + D + h + m + s;
                return dateString;
            },
            async getUserList() {
                this.isLoading = true
                let res1 = await getFileListDetailApi()
                let detailInfo = res1.data
                let res2 = await getUserFileApi(this.uid)
                let res
                if(this.auth == 1){
                    res = res1
                } else {
                    res = res2
                }
                    if(res.type === 'success'){
                        this.userList = res.data
                        //处理后端返回的时间
                        this.userList.forEach(element => {
                            element.uploadDate = this.transformTimestamp(element.uploadDate)
                        })
                    }
                    else{
                        this.$Message.error('获取数据集失败');
                    }
                //任务类型选项
                let taskList = await getTaskTypeApi()
                    if(taskList.type === 'success'){
                        this.taskOption = taskList.data  
                    }
                    else{
                        this.$Message.error('获取任务类型失败');
                    }

                //适用对象选项
                let userlist = await getUsersApi()
                    if(userlist.type === 'success'){
                        this.userOption = userlist.data
                        if(this.auth == 0){
                            this.userOption = this.userOption.filter((item)=>{return item.id == this.uid})
                        }
                    }
                    else{
                        this.$Message.error('获取适用对象列表失败');
                    } 
                
                //输入数据类型选项
                let inlist = await getINModelApi()
                    if(inlist.type === 'success'){
                        this.inputOption = inlist.data
                    }
                    else{
                        this.$Message.error('获取输入数据类型列表失败');
                    }
                
                if(this.auth == 0){
                    //admin初始数据的接口是详细数据，user初始数据的接口是简单数据，需要通过id得到对应的文字信息
                    this.userList.forEach(element => {
                        this.userOption.forEach(user => {
                            if(element.uid === user.id){
                                this.$set(element,"username",user.username)

                            }
                        })
                        this.taskOption.forEach(task => {
                            if(element.taskTid === task.id){
                                this.$set(element,"taskTypeName",task.func)
                            }
                        })
                        this.inputOption.forEach(input => {
                            if(element.inputTid === input.id){
                                this.$set(element,"inputTypeName",input.name)
                            }
                        })
                        detailInfo.forEach(item=>{
                            if(element.id === item.id){
                                this.$set(element,"inputBatchSize",item.inputBatchSize)
                            }
                        })
                    });
                }
                this.isLoading = false
            },

            
            //解决select组件清空后参数值变成undefined的问题，避免搜索参数出错
            selectClear(key) {
                if(this.searchOption[key] == undefined){
                    this.searchOption[key] = ''
                }
            },
            cancel() {
                this.isModal = false
            },
            handleBeforeUpload(file){
                this.formValidate.sigFile = file;
                return false;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '请上传csv文件'
                });
            },
            handleCancel(form) {
                this.$Message.info('取消添加');
                this.$refs[form].resetFields();
                this.isModal=false;
            },
            handleSubmit (formname) { //提交表单
                let isfile = this.formValidate.sigFile
                this.$refs[formname].validate(async(valid) => {
                    if (valid && isfile!=='') {                     
                        //上传数据
                        let addData={
                            uid:this.formValidate.uid,
                            taskTid:this.formValidate.taskTid,
                            inputTid:this.formValidate.inputTid,
                            label:this.formValidate.label,
                            sigFile:this.formValidate.sigFile
                        }
                        let res = await addFileApi(addData)
                        if(res.type === "success"){
                            this.$Message.success('添加成功!');
                            this.getUserList()
                        }
                        else{
                            this.$Message.error(res.message);
                        }
                        this.isModal = false
                    }
                    else if(isfile===''){
                        this.$Message.error('请选择上传文件！');
                    }
                    else {
                        this.$Message.error('填写内容有误，请检查后重新提交！');
                        
                    }
                })
            },
            async remove (deleteId,row) {
                this.isLoading = true
                let res = await deleteFileApi(deleteId)
                if(res.type==="success"){
                    this.userList.splice(row, 1)
                    this.$Message.success('删除成功')
                }    
                else {
                    this.$Message.error("删除失败");
                }
                this.isLoading = false
            },
            async searchItem() {
                if (this.auth == 0){
                    this.searchOption.value2 = this.uid
                }
                let paramsdata = {
                    fname:this.searchOption.value1,
                    userId:this.searchOption.value2,
                    taskTid:this.searchOption.value3,
                    inputTid:this.searchOption.value4,
                    uploadDate:this.searchDate
                }
                let res = await searchFileApi(paramsdata)
                    if(res.data.length===0){
                        this.$Message.error('没有找到匹配的结果');
                    }
                    else {
                        this.$Message.success('查找成功');
                        this.userList = res.data   
                        let res1 = await getFileListDetailApi()
                        let detailInfo = res1.data
                        this.userList.forEach(element => {
                            this.userOption.forEach(user => {
                                if(element.uid === user.id){
                                    this.$set(element,"username",user.username)

                                }
                            })
                            this.taskOption.forEach(task => {
                                if(element.taskTid === task.id){
                                    this.$set(element,"taskTypeName",task.func)
                                }
                            })
                            this.inputOption.forEach(input => {
                                if(element.inputTid === input.id){
                                    this.$set(element,"inputTypeName",input.name)
                                }
                            })
                            detailInfo.forEach(item=>{
                                if(element.id === item.id){
                                    this.$set(element,"inputBatchSize",item.inputBatchSize)
                                }
                            })
                        });
                    }
            },
            
            async downloadFile(id) {
                let res = await downLoadSigFileApi(id)
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
            //预览文件
            async previewFile(fname) {
                this.isModalPreview = true
                this.isLoading2 = true
                this.previewFileName = fname
                let res = await getModelFileApi("pro_"+this.previewFileName)
                let data = d3.csvParse(res)
                //console.log(data)
                for(let i=0;i<data.length;i++){
                    //console.log(data[i])
                    let time=Number(data[i].timestamp)
                    //console.log(this.transformTimestamp(time))
                    this.lineData.xData.push(this.transformTimestamp(time))
                    this.lineData.data[0].data.push(data[i].ecg)
                }
                this.isLoading2 = false
            },
            handleSelectionChange(val) {
                this.trainInfo=[];
                for(let i=0;i<val.length;i++){
                    this.trainInfo.push(
                        {
                            id:val[i].id,
                            fname:val[i].fname
                        }
                    )
                }
            },
            handleclick(){
                if(this.trainInfo.length==0){
                    this.$Message.error('请选择要训练的数据集');
                    return;
                }
                this.setTrainInfo(this.trainInfo);
                this.$router.push('./trainModel')
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
    .line-box{
        
        margin-top: -50px;
    }
    
</style>