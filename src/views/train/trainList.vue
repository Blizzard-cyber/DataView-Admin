
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
                    <Option v-for="item in userOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="3">
                <Select v-model="searchOption.value3" clearable placeholder="任务类型" @on-change="selectClear('value3')">
                    <Option v-for="item in taskOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </col>
            <Col span="3">
                <Select v-model="searchOption.value4" clearable placeholder="输入类型" @on-change="selectClear('value4')"> 
                    <Option v-for="item in inputOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </col>
            <Col span="5">
                <DatePicker v-model="searchOption.value5" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="创建日期" show-week-numbers/>
            </Col>
            <Col span="5">
                <Button @click="searchItem" >查询</Button>
                <Button type="primary" style="margin-left:10px;" @click="isModal=true">新增</Button>
                <Button type="primary" to="/trainModel" style="margin-left:10px;">训练</Button>
            </Col>
        </Row>
        <Modal v-model="isModal" title="新增数据集">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
                <FormItem label="训练对象" prop="uid">
                    <Select v-model="formValidate.uid" placeholder="请选择" style="width:250px">
                        <Option v-for="item in userOption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                    </Select>
                </FormItem>
                <FormItem label="任务类型" prop="taskTid">
                    <Select v-model="formValidate.taskTid" placeholder="请选择" style="width:250px">
                        <Option v-for="item in taskOption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                    </Select>
                </FormItem>
                <FormItem label="输入类型" prop="inputTid">
                    <Select v-model="formValidate.inputTid" placeholder="请选择" style="width:250px">
                        <Option v-for="item in inputOption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
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
        <Table height="400" border :columns="columns" :data="userList"></Table>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getFileListApi, searchFileApi, addFileApi, deleteFileApi } from "../../network/api/trainApi"
export default {
        data () {
            return {
                isModal: false,
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
                        key: 'uid',
                        align: 'center'
                    },
                     {
                        title: '任务类型',
                        width: 100,
                        key: 'taskTid',
                        align: 'center'
                    },
                    {
                        title: '输入类型',
                        width: 100,
                        key: 'inputTid',
                        align: 'center'
                    },
                    {
                        title: '标签',
                        width: 100,
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
                        width: 130,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
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
                                            const userData = params.row
                                            this.downloadFile(userData)
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
                modalItem: [
                    {
                        label: '姓名',
                        value: '',
                    },
                    {
                        label: '年龄',
                        value: '',
                    },
                    {
                        label: '性别',
                        value: ''
                    }
                ],
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
            async getUserList() {
                let res = await getFileListApi()
                if(res.type === 'success'){
                    this.userList = res.data
                    this.getOptionList('uid');
                    this.getOptionList('taskTid');
                    this.getOptionList('inputTid');
                }
                else{
                    this.$Message.error('获取数据集失败');
                }
            },
            //将表中数据选项转换为数组
            getOptionList(op) {
                //将userList中的的值提取出来放入数组
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
                    this.userOption = arr3
                }
                else if(op === "taskTid"){
                    this.taskOption = arr3
                } 
                else if(op === "inputTid"){
                    this.inputOption = arr3
                }
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
                    createDate:this.searchDate
                }
                let res = await searchFileApi(paramsdata)
                    if(res.data.length===0){
                        this.$Message.error('没有找到匹配的结果');
                    }
                    else {
                        this.$Message.success('查找成功');
                        this.userList = res.data   
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