<template>
  <div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型管理</BreadcrumbItem>
            <BreadcrumbItem>模型添加</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
      <FormItem label="模型文件" prop="file">
         <Upload 
            action=""
            :before-upload="handleBeforeUpload"
            >
           <Button icon="ios-cloud-upload-outline">读取文件</Button>
        </Upload>
        <div v-if="formValidate.file!== null">
             {{ formValidate.file.name }} 
        </div>
      </FormItem>
        <FormItem label="模型名称" prop="name">
            <Input v-model="formValidate.name" placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="模型功能" prop="mfunction">
            <Select v-model="formValidate.mfunction" placeholder="请选择" style="width:250px">
                <Option v-for="item in funcoption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
            </Select>
        </FormItem>
       <FormItem label="适用对象" prop="mobject">
            <Select v-model="formValidate.mobject" placeholder="请选择" style="width:250px">
                <Option v-for="item in objectoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="输入数据秒数" prop="dsecond">
            <Input v-model="formValidate.dsecond" placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem
                v-for="(item, index) in formDynamic.items"
                v-if="item.status"
                :key="index"
                :label="'输入数据维度 ' + item.index"
                :prop="'items.' + index + '.value'"
                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Row>
                <Col span="6">
                    <Input type="text" v-model="item.value" placeholder="" style="width:250px" ></Input>
                </Col>
                
                <Col span="6" offset="0">
                    <Button @click="handleRemove(index)">删除</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Row>
                <Col span="6">
                    <Button type="dashed" @click="handleAdd" icon="md-add" style="width:130px">增加维度</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="输入数据类型" prop="intype">
         <!-- <Button type="primary" @click="isModal=true">点击选择</Button>
            <Modal
                v-model="isModal"
                :styles="{top:'60px'}" >
                <p slot="header" style="font-size:16px">
                    <span>选择数据类型</span>
                </p>
                 <Table highlight-row ref="currentRowTable" :columns="columns3" :data="data1"></Table>
                
            
            </Modal> -->
            
            <Select v-model="formValidate.intype" placeholder="请选择"  style="width:250px">
                <Option v-for="item in intypeoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                
            </Select> 
        </FormItem>
        
        <FormItem label="输出数据类型" prop="outtype">
            <Select v-model="formValidate.outtype" placeholder="请选择" style="width:250px" >
                <Option v-for="item in outtypeoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="缺少数据类型？">
            <Button type="warning" @click="isModal=true">点我添加</Button>
            <Modal
                v-model="isModal"
                
                :styles="{top:'60px'}" >
                <p slot="header" style="font-size:16px">
                    <span>添加数据类型</span>
                </p>
                <Form :label-width="80" ref="addformValidate" :model="addformValidate" :rules="addruleValidate">
                    <FormItem label="" prop="addtype">
                        <RadioGroup v-model="addformValidate.addtype" >
                            <Radio label="输入数据类型" border style="margin-left:20px"></Radio>
                            <Radio label="输出数据类型" border style="margin-left:40px"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem label="数据名称" prop="dataname">
                                <Input v-model="addformValidate.dataname" placeholder="" ></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="数据长度" prop="datalength">
                                <Input v-model="addformValidate.datalength" placeholder="" ></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="数据描述" prop="datadescription">
                        <Input v-model="addformValidate.datadescription" placeholder=""  type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    

                </Form>
                <div slot="footer">
                    <slot name="footer">
                        <Button type="text" size="large" @click="handleCancel('addformValidate')">取消</Button>
                        <Button type="primary" size="large" @click="handleOK('addformValidate')">提交</Button>
                    </slot>
                </div>
                
            
            </Modal> 
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确认提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">清除内容</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import{getModelListApi,getINModelApi,getOUTModelApi,addModelApi} from '../../network/api/modelApi'
    export default {
        data () {
            return {
                gindex: 1,
                isModal:false,//弹出框打开状态
                
                funcoption: [], //功能选项
                objectoption: [], //适用对象选项
                intypeoption: [],//输入数据类型选项
                outtypeoption: [],//输出数据类型选项
                addformValidate:{
                    addtype:'', //添加数据类型
                    dataname:'',
                    datalength:'',
                    datadescription:''
                },
                addruleValidate:{ //添加数据类型表单校验规则
                    
                    dataname: [
                        { required: true, message: '数据名称不能为空', trigger: 'blur' },
                        // { type: 'string', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    datalength: [
                        { required: true, message: '数据长度不能为空', trigger: 'blur' },
                        { type: 'number', min:1,max:1000, message: '数据长度在1-1000之间', trigger: 'blur', transform: (value) => Number(value) }
                    ],
                    datadescription: [
                        { required: true, message: '数据描述不能为空', trigger: 'blur' },
                        // { type: 'string', message: 'Incorrect email format', trigger: 'blur' }
                    ]
                },
                
                
                formDynamic: {
                    items: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
               
                formValidate: {
                    file: '',
                    name: '',
                    mfunction: '',
                    mobject: '',
                    dsecond: '',
                    dimlist: '',
                    intype:'',
                    outtype:''
                },
                ruleValidate: { //模型添加表单校验规则
                    name: [
                        { required: true, message: '模型名称不能为空', trigger: 'blur' },
                        // { type: 'string', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    mfunction: [
                        { required: false,  trigger: 'change' }
                    ],
                    mobject: [
                        { required: false, trigger: 'change' }
                    ],
                    dsecond: [
                        { required: true, type: 'number', message: '请输入正确的数据秒数', trigger: 'blur' },
                        // { type: 'number', min:1,max: 10000, message: '请输入正确的数据秒数', trigger: 'blur' }
                    ],
                    intype: [
                        { required: false,  trigger: 'change' }
                    ],
                    outtype: [
                        { required: false, trigger: 'change' }
                    ],
                    // desc: [
                    //     { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                    //     { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    // ]
                }
            }
        },
        created () {
            this.getUserList() //获取所有选项的值
        },
        methods: {
           async getUserList() {
            let modellist = await getModelListApi()
                if(modellist.type === 'success'){
                    this.userList = modellist.data
                    
                    let op1="uid"
                    let op2="taskTid"
                    this.getOptionList(op1);
                    this.getOptionList(op2);
                }
                else{
                    this.$Message.error('获取选项列表失败');
                }
               
            let inlist = await getINModelApi()
                if(inlist.type === 'success'){
                    this.userList = inlist.data
                    //console.log(inlist.data)
                    let op="name"
                    let type="input"
                    this.getOptionList(op,type);
                }
                else{
                    this.$Message.error('获取输入数据类型列表失败');
                }

            let outlist = await getOUTModelApi()
                if(outlist.type === 'success'){
                    this.userList = outlist.data
                    //console.log(outlist.data)
                    let op="name"
                    let type="output"
                    this.getOptionList(op,type);
                }
                else{
                    this.$Message.error('获取输出数据类型列表失败');
                }  
            },
            //将表中数据选项转换为数组
            getOptionList(op,type) {
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
                else if(type === "input"){
                    this.intypeoption = arr3
                    //console.log(this.intypeoption)
                }
                else if(type === "output"){
                    this.outtypeoption = arr3
                    //console.log(this.outtypeoption)
                }
            },
            handleOK(form){
                
                this.$refs[form].validate((valid) => {
                    if (valid && this.addformValidate.addtype!=='') {
                        
                        this.$Message.success('Success!');
                        //this.isModal=false;
                    } 
                    else if(this.addformValidate.addtype===''){
                        this.$Message.error('请选择添加类型！');
                    }
                    else {
                        this.$Message.error('填写内容有误，请检查后重新提交！');
                    }
                })
                
                // this.$refs[form].validate((valid) => {
                //     console.log(valid);
                //     if (valid) {
                //         this.$Message.success('Success!');
                //         this.isModal=false;
                //     } else {
                //         this.$Message.error('Fail!');
                //     }
                // })

            },
            handleCancel(form){
                this.$Message.info('取消添加');
                this.$refs[form].resetFields();
                this.isModal=false;
                // tis.$Message.info('Clicked cancel');
                // this.isModal=false;
             },
            
            handleBeforeUpload(file){
                this.formValidate.file = file;
                return false;
            },
            async handleSubmit (name) { //提交表单
             let adddata={
                    modelFile:this.formValidate.file,
                    name:this.formValidate.name,
                    taskTid:this.formValidate.mfunction,
                    uid:this.formValidate.mobject,
                    second:this.formValidate.dsecond,
                    dimShapeList:this.formValidate.dimlist,
                    inputTypeIdList:this.formValidate.intype,
                    outputTid:this.formValidate.outtype
             }
                let res = await addModelApi(adddata)
                if(res.type === "success"){
                    this.$Message.success('添加成功!');
                }
                else{
                    this.$Message.error(res.message);
                }

                // this.$refs[name].validate((valid) => {
                //     if (valid) {
                //         this.$Message.success('Success!');
                //     } else {
                //         this.$Message.error('Fail!');
                //     }
                // })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
           
            handleAdd () {
                this.gindex++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.gindex,
                    status: 1
                });
            },
            handleRemove (index) {
                if(this.gindex>1){
                
                this.formDynamic.items[index].status = 0;
                this.gindex--;
            }
            else{
                this.$Message.error('至少保留一个输入数据类型');
            }
            }
        }
    }
</script>

<style>

</style>