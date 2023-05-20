
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
                    <Select v-model="formValidate.label" placeholder="请选择" style="width:250px">
                        <Option v-for="item in labelOption" :value="item.value" :key="item.value">{{ item.label }}</Option>  
                    </Select> 
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
        <Table height="400" border :columns="columns" :data="userList" @on-selection-change="handleSelectionChange"></Table>

         <Modal v-model="isModalPreview" fullscreen title="数据集预览">
             <p slot="header" style="text-align:center">
                <Icon type="ios-analytics-outline"></Icon>
                <span>{{previewFileName}}</span>
            </p>
            <div>This is a fullscreen modal</div>
            <div slot="footer">
                <slot name="footer">
                    <Button type="success" @click="isModalPreview=false">关闭</Button>
                    
                </slot>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getTaskTypeApi,getINModelApi } from '../../network/api/modelApi'
import { getUsersApi } from '../../network/api/userApi'
import { getFileListApi, getFileListDetailApi, searchFileApi, addFileApi, deleteFileApi, downLoadSigFileApi } from "../../network/api/trainApi"
export default {
        data () {
            return {
                isModal: false,
                isModalPreview: false,
                previewFileName:'',
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
                        width: 120,
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
                                                    this.remove(params.row.id);
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
                        { required: true, message:'请选择标签类型', trigger: 'change', type: 'number'}
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
            this.getUserList()
        },
        methods: {
            ...mapMutations(['setTrainInfo']),
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
                let res = await getFileListDetailApi()
                    if(res.type === 'success'){
                        this.userList = res.data
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
            },

            // //将表中数据选项转换为数组
            // getOptionList(op) {
            //     //将userList中的的值提取出来放入数组
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
            //         this.userOption = arr3
            //     }
            //     else if(op === "taskTypeName"){
            //         this.taskOption = arr3
            //     } 
            //     else if(op === "inputTypeName"){
            //         this.inputOption = arr3
            //     }
            // },

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
            async remove (deleteId) {
                if (this.auth==1){
                    let res = await deleteFileApi(deleteId)
                    if(res.type==="success"){
                        this.getUserList()
                        this.$Message.success('删除成功')
                    }    
                    else {
                        this.$Message.error("删除失败");
                    }
                } else {
                    this.$Message.error('没有权限');
                }
            },
            async searchItem() {
                let paramsdata = {
                    fname:this.searchOption.value1,
                    userId:this.searchOption.value2,
                    taskTypeId:this.searchOption.value3,
                    inputTid:this.searchOption.value4,
                    uploadDate:this.searchDate
                }
                console.log(paramsdata);
                let res = await searchFileApi(paramsdata)
                    if(res.data.length===0){
                        this.$Message.error('没有找到匹配的结果');
                    }
                    else {
                        this.$Message.success('查找成功');
                        this.userList = res.data   
                        this.userList.forEach(element => {
                            this.userOption.forEach(user => {
                                if(element.uid === user.id){
                                    element.username = user.username
                                }
                            })
                            this.taskOption.forEach(task => {
                                if(element.uid === task.id){
                                    element.taskTypeName = task.func
                                }
                            })
                            this.inputOption.forEach(input => {
                                if(element.inputTid === input.id){
                                    element.inputTypeName = input.name
                                }
                            })
                        });
                    }
            },
            async downloadFile(id) {
                let res = await downLoadSigFileApi(id)
                // const dowmName=res.headers['content-type'].split('.')[0]   //获取下载文件名称（在请求头中）
                // const url = window.URL.createObjectURL(new Blob([res]))
                // const link = document.createElement('a')
                // link.style.display = 'none'
                // link.href = url
                // link.setAttribute(
                //     'download',
                //     `${dowmName}.xlsx`
                // )
                // document.body.appendChild(link)
                // link.click()
                console.log(res);
            },
            previewFile(fname) {
                this.isModalPreview = true
                this.previewFileName = fname
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
                console.log(this.trainInfo)
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
</style>