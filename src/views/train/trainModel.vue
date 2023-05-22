<template>
  <div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="250">
        <FormItem label="训练名称  [name]" prop="trainName">
             <Input v-model="formValidate.trainName" placeholder="请输入训练名称" style="width:250px"></Input>
        </FormItem>
        <FormItem label="选择数据集  [sigFileIdList]" prop="signalList">
            <Input v-model="formValidate.signalList" disabled type="textarea" :rows="4" placeholder="" style="width:250px"></Input>
            <Button type="warning" to="/trainList" style="margin-left: 10px;">重新选择</Button>
        </FormItem>
        <FormItem label="训练对象  [uid]" prop="trainFor">
            <Select v-model="formValidate.trainFor" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in uidList" :value="item.id" :key="index">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="模型选择  [method]" prop="trainMethod">
            <Select v-model="formValidate.trainMethod" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in methodList" :value="item.value" :key="index">{{ item.label }}</Option> 
            </Select>
        </FormItem>
        <FormItem label="训练轮数  [epoch]" prop="epoch">
            <Input v-model="formValidate.epoch"  placeholder="请输入训练轮数" style="width:250px"></Input>
        </FormItem>      
        <FormItem label="学习率   [learningRate]" prop="learningRate">
            <Input v-model="formValidate.learningRate" placeholder="请输入学习率" style="width:250px"></Input>
        </FormItem>
        <FormItem label="批大小   [batchSize]" prop="batchSize">
            <Input v-model="formValidate.batchSize"  placeholder="请输入batchSize" style="width:250px"></Input>
        </FormItem>
        <FormItem label="切片大小  [second]" prop="secondSize">
            <Input v-model="formValidate.secondSize"  placeholder="请输入切片大小" style="width:250px"></Input>
        </FormItem>
         <FormItem label="是否监督  [isSupervised]" prop="isSupervised">
           <RadioGroup v-model="formValidate.isSupervised">
                <Radio label="1" border>监督学习</Radio>
                <Radio label="0" border>无监督学习</Radio>
            </RadioGroup>
        </FormItem>
         <FormItem label="任务类型  [taskTid]" prop="taskType">
            <Select v-model="formValidate.taskType" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in taskList" :value="item.id" :key="index">{{ item.func }}</Option>
            </Select>
        </FormItem>
         <FormItem label="输出类型    [outputTid]" prop="outputType">
             <Select v-model="formValidate.outputType" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in outputList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 10px">确认提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 18px">清除内容</Button>
        </FormItem>
    </Form>
    <Spin size="large" fix v-if="isLoading"></Spin>
  </div>
</template>

<script>
import {getUsersApi} from '../../network/api/userApi'
import {getTaskTypeApi,getOUTModelApi} from '../../network/api/modelApi' 
import {addTrainApi,getUserFileApi,getFileListApi} from '../../network/api/trainApi' 
import {mapGetters,mapState} from 'vuex'
    export default {
        data () {
            return {
                isLoading:false,
                uidList: [ //训练对象选项
                   
                ],
                methodList: [ //模型选择选项
                    {
                        value: 'CNN',
                        label: 'CNN'
                    },
                    {
                        value: 'RNN',
                        label: 'RNN'
                    },
                    {
                        value: 'ResNet',
                        label: 'ResNet'
                    }
                ],
                taskList: [ //任务类型选项
                   
                ],
                outputList: [ //输出类型选项
                    
                ],
                trainFileList: [], //传递过来的训练集
                formValidate: {
                    trainName: '', //训练名称
                    signalList: '',  //选择数据集
                    trainFor: '',  //训练对象
                    trainMethod: '',  //模型选择
                    epoch: '',  //训练轮数
                    learningRate: '', //学习率
                    batchSize: '',  //批大小
                    secondSize: '',   //切片大小
                    isSupervised: '',  //是否监督
                    taskType: '',   //任务类型
                    outputType: '',  //输出类型
                    
                },
                ruleValidate: {
                    trainName: [
                        { required: true, message: '训练名称不能为空', trigger: 'blur' }
                    ],
                    signalList: [
                        { required: true,message:'缺少数据集', trigger: 'blur'}
                    ],
                    trainFor: [
                        { required: true, message: '请选择训练对象', trigger: 'change',type:'number' }
                    ],
                    trainMethod: [
                        { required: true, message: '请选择训练模型', trigger: 'change' }
                    ],
                    epoch: [
                        { required: true, message: '训练轮数不能为空', trigger: 'blur' },
                        {type: 'number', min:1,max:100, message: '请输入正确训练轮数', trigger: 'blur',transform: (value) => Number(value)}
                    ],
                    learningRate: [
                        { required: true, message: '学习率不能为空', trigger: 'blur' },
                        {type: 'number', min:0,max:1, message: '请输入正确学习率', trigger: 'blur',transform: (value) => Number(value)}
                    ],
                    batchSize: [
                        { required: true, message: '批大小不能为空', trigger: 'blur' },
                        {type: 'number', min:1,max:100, message: '请输入正确batchSize', trigger: 'blur',transform: (value) => Number(value)}
                    ],
                    secondSize: [
                        { required: true, message: '切片大小不能为空', trigger: 'blur' },
                        {type: 'number', min:1,max:100, message: '请输入正确切片大小', trigger: 'blur',transform: (value) => Number(value)}
                    ],
                    isSupervised: [
                        { required: true, message: '请选择训练类型', trigger: 'change' }
                    ],
                    taskType: [
                        { required: true, message: '任务类型不能为空', trigger: 'change',type:'number' }
                    ],
                    outputType: [
                        { required: true, message: '输出类型不能为空', trigger: 'change',type:'number' }
                    ],
                    
                }
            }
        },
        computed: {
            ...mapState(["token","uid","auth"]),
        },
        created () {
           this.getList()
        },
        mounted() {
            this.getData();
        },
        methods: {
            ...mapGetters(['gettrainInfo']),
            async getData(){
                let res=''
                this.isLoading = true
                this.trainFileList = this.gettrainInfo()
                if(this.trainFileList.length===0){  //如果没有传递过来的数据集
                    if(this.uid==='1'){
                        res = await getFileListApi()  //获取所有数据集[admin]
                    }
                    else{
                        res = await getUserFileApi(this.uid)  //获取当前用户数据集
                    }
                   
                    console.log(res)
                    if(res.type==="success"){
                        let userFile = res.data
                        if(userFile.length!==0){
                            userFile.forEach(element=>{
                                this.trainFileList.push(
                                    {
                                        id:element.id,
                                        fname:element.fname
                                    }
                                )
                            })
                        }
                        else{
                            this.$Message.error('当前用户没有数据集');
                        }
                    } else {
                        this.$Message.error('获取当前用户数据集失败');
                    }
                }
                this.formValidate.signalList = ""
                this.trainFileList.forEach(element => {
                    this.formValidate.signalList += element.fname + "\n"
                })
                this.isLoading = false
            },
            async getList(){
                //获取训练对象列表
             let userList = await getUsersApi()
                if(userList.type == 'success'){
                    this.uidList = userList.data
                    if(this.auth == 0){
                        this.uidList = this.uidList.filter((item)=>{return item.id == this.uid})
                    }
                }
                else{
                    this.$Message.error('获取训练对象列表失败')
                }

                //获取任务类型列表
                let taskList = await getTaskTypeApi()  
                if(taskList.type == 'success'){
                    this.taskList = taskList.data
                }
                else{
                    this.$Message.error('获取任务类型列表失败')
                }
                
                //获取输出类型列表
                let outputList = await getOUTModelApi()
                if(outputList.type == 'success'){
                    this.outputList = outputList.data
                }
                else{
                    this.$Message.error('获取输出类型列表失败')
                }
            },
            handleSubmit (name) {
                this.isLoading = true
                this.$refs[name].validate(async(valid) => {
                    if (valid) {
                        let FileList = []
                        this.trainFileList.forEach(element=>{
                            FileList.push(element.id)
                        })
                        let FileString = FileList.join(",")
                        let trainData={
                            name:this.formValidate.trainName,
                            method:this.formValidate.trainMethod,
                            uid:this.formValidate.trainFor,
                            epoch:this.formValidate.epoch,
                            learningRate:this.formValidate.learningRate,
                            batchSize:this.formValidate.batchSize,
                            isSupervised:this.formValidate.isSupervised,
                            second:this.formValidate.secondSize,
                            taskTid:this.formValidate.taskType,
                            outputTid:this.formValidate.outputType,
                            sigFileIdList:FileString
                        }
                        let res = await addTrainApi(trainData)
                        if(res.type==="success"){
                            this.$Message.success('添加训练任务成功，开始训练!');
                        }else {
                            this.$Message.error(res.message);
                        }
                    } else {
                        this.$Message.error('填写内容不完整或有误，请重新填写！');
                    }
                })
                this.isLoading = false
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
        }
    }
</script>

<style>
    .demo-spin-container{
        position: relative;
    }
</style>