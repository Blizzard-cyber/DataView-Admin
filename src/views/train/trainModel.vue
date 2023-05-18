<template>
  <div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
        <FormItem label="训练名称name" prop="trainName">
             <Input v-model="formValidate.trainName" placeholder="请输入训练名称" style="width:250px"></Input>
        </FormItem>
        <FormItem label="选择数据集sigFileIdList" prop="signalList">
            <Input v-model="formValidate.signalList" disabled type="textarea" placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="训练对象uid" prop="trainFor">
            <Select v-model="formValidate.trainFor" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in uidList" :value="item.id" :key="index">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="模型选择method" prop="trainMethod">
            <Select v-model="formValidate.trainMethod" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in methodList" :value="item.value" :key="index">{{ item.label }}</Option> 
            </Select>
        </FormItem>
        <FormItem label="训练轮数epoch" prop="epoch">
            <Input v-model="formValidate.epoch"  placeholder="请输入训练轮数" style="width:250px"></Input>
        </FormItem>
        
        <FormItem label="学习率learningRate" prop="learningRate">
            <Input v-model="formValidate.learningRate" placeholder="请输入学习率" style="width:250px"></Input>
        </FormItem>
        <FormItem label="批大小batchSize" prop="batchSize">
            <Input v-model="formValidate.batchSize"  placeholder="请输入batchSize" style="width:250px"></Input>
        </FormItem>
        <FormItem label="切片大小second" prop="secondSize">
            <Input v-model="formValidate.secondSize"  placeholder="请输入切片大小" style="width:250px"></Input>
        </FormItem>
         <FormItem label="是否监督isSupervised" prop="isSupervised">
           <RadioGroup v-model="formValidate.isSupervised">
                <Radio label="监督学习" border></Radio>
                <Radio label="无监督学习" border></Radio>
            </RadioGroup>
        </FormItem>
         <FormItem label="任务类型taskTid" prop="taskType">
            <Select v-model="formValidate.taskType" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in taskList" :value="item.id" :key="index">{{ item.func }}</Option>
            </Select>
        </FormItem>
         <FormItem label="输出类型outputTid" prop="outputType">
             <Select v-model="formValidate.outputType" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in outputList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确认提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">清除内容</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {getUsersApi} from '../../network/api/userApi'
import {getTaskTypeApi,getOUTModelApi} from '../../network/api/modelApi'
    export default {
        data () {
            return {
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
                        { required: true, message: '请选择训练对象', trigger: 'change' }
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
                        { required: true, message: '任务类型不能为空', trigger: 'change' }
                    ],
                    outputType: [
                        { required: true, message: '输出类型不能为空', trigger: 'change' }
                    ],
                    
                }
            }
        },
        created () {
           this.getList()
        },
        methods: {
            async getList(){
                //获取训练对象列表
             let userList = await getUsersApi()
                if(userList.type == 'success'){
                    this.uidList = userList.data
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
                this.$refs[name].validate(async(valid) => {
                    if (valid) {
                        
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('填写内容不完整或有误，请重新填写！');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
        }
    }
</script>

<style>

</style>