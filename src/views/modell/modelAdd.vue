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
                <Option v-for="(item,index) in funcoption" :value="item.id" :key="index">{{ item.func }}</Option> 
            </Select>
        </FormItem>
       <FormItem label="适用对象" prop="mobject">
            <Select v-model="formValidate.mobject" placeholder="请选择" style="width:250px">
                <Option v-for="(item,index) in objectoption" :value="item.id" :key="index">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="输入数据秒数" prop="dsecond">
            <Input v-model="formValidate.dsecond" placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem
                v-for="(item, index) in formValidate.dimlist"
                :key="index"
                :label="'输入数据维度 ' + index"
                :prop="'dimlist.' + index + '.value'"
                :rules="[{required: true, message: '输入数据维度 ' + index +' 不能为空', trigger: 'blur'},
                { type: 'number', min:1,max:100, message: '数据维度在1-100之间', trigger: 'blur', transform: (value) => Number(value) }]">
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
            <Select v-model="formValidate.intype" multiple filterable placeholder="请选择"  style="width:250px">
                <Option v-for="(item,index) in intypeoption" :value="item.id" :key="index">
                    <!-- {{ item.label }} -->
                    <span>{{item.name}}</span>
                    <span style="float:right;margin-right: 10%;color:#ccc">{{item.batchSize}}</span>
                </Option>
            </Select> 
        </FormItem>
        
        <FormItem label="输出数据类型" prop="outtype">
            <Select v-model="formValidate.outtype"  placeholder="请选择"  style="width:250px" >
                <Option v-for="item in outtypeoption" :value="item.id" :key="item.id">  
                    {{ item.name }}
              
                    <!-- <span>{{item.name}}</span> -->
                    <!-- <span style="float:right;color:#ccc">{{item.batchSize}}</span>            -->
                    
                </Option>
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
import{getTaskTypeApi,getINModelApi,getOUTModelApi,addModelApi,addINModelApi,addOUTModelApi} from '../../network/api/modelApi'
import{getUsersApi} from '../../network/api/userApi'
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
        
                formValidate: {
                    file: '',
                    name: '',
                    mfunction: '',
                    mobject: '',
                    dsecond: '',
                    dimlist: [
                        {
                            value: '',
                        }
                    ],
                    intype:'',
                    outtype:''
                },
                ruleValidate: { //模型添加表单校验规则
                    name: [
                        { required: true, message: '模型名称不能为空', trigger: 'blur' },
                        // { type: 'string', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    mfunction: [
                        { required: true, message:'请选择模型功能' ,trigger: 'change',type:'number' }
                    ],
                    mobject: [
                        { required: true, message:'请选择适用对象', trigger: 'change' ,type:'number' }
                    ],
                    dsecond: [
                        { required: true,  message: '请输入数据秒数', trigger: 'blur' },
                        { type: 'number', min:1,max: 10000, message: '请输入正确的数据秒数', trigger: 'blur', transform: (value) => Number(value) }
                    ],
                    intype: [
                        { required: true, message:'请选择输入数据类型', trigger: 'bulr',type:'array' }
                    ],
                    outtype: [
                        //{ required: true, message:'请输入输出数据类型', trigger: 'change',type:'number' }
                    ],
                    
                }
            }
        },
        created () {
            this.getUserList() //获取所有选项的值
        },
        methods: {
           async getUserList() {
            //let modellist = await getModelListApi()
            //模型功能选项
            let taskList = await getTaskTypeApi()
                if(taskList.type === 'success'){
                    this.funcoption = taskList.data  
                }
                else{
                    this.$Message.error('获取功能列表失败');
                }
            
            //适用对象选项
            let userlist = await getUsersApi()
                if(userlist.type === 'success'){
                    this.objectoption = userlist.data
                    //console.log(this.objectoption)
                }
                else{
                    this.$Message.error('获取适用对象列表失败');
                } 
               
               //输入数据类型选项
            let inlist = await getINModelApi()
                if(inlist.type === 'success'){
                    this.intypeoption = inlist.data
                    //console.log(this.intypeoption)
                    
                }
                else{
                    this.$Message.error('获取输入数据类型列表失败');
                }

            //输出数据类型选项
            let outlist = await getOUTModelApi()
                if(outlist.type === 'success'){
                    this.outtypeoption = outlist.data          
                }
                else{
                    this.$Message.error('获取输出数据类型列表失败');
                }  
            },
            //将表中数据选项转换为数组
            // getOptionList(op) {
            //     //将userList中的uid项的值提取出来放入数组
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
            //     if(op === "uid"){
            //         this.objectoption = arr3
            //         //console.log(this.objectoption)
            //     }
            //     else if(op === "taskTid"){
            //         this.funcoption = arr3
            //         //console.log(this.funcoption)
            //     }
                
            // },
            //提交数据类型添加
             handleOK(form){
                let datatype = this.addformValidate.addtype
                this.$refs[form].validate(async(valid) => {
                    if (valid && datatype!=='') {
                        let addtype={
                               name:this.addformValidate.dataname,
                               batchSize:this.addformValidate.datalength,
                               desc:this.addformValidate.datadescription
                        }
                        // console.log(datatype)
                        if(datatype==="输入数据类型"){
                            let addintype = await addINModelApi(addtype)
                            if(addintype.type === 'success'){
                                this.$Message.success('添加成功!');
                                this.isModal=false;
                                this.getUserList()//刷新选项
                            }
                            else{
                                this.$Message.error('添加失败！');
                            }
                        }
                        else if(datatype==="输出数据类型"){
                            let addouttype = await addOUTModelApi(addtype)
                            if(addouttype.type === 'success'){
                                this.$Message.success('添加成功!');
                                this.isModal=false;
                                this.getUserList() //刷新选项
                            }
                            else{
                                this.$Message.error('添加失败');
                            }
                                
                        }
                    } 
                    else if(datatype===''){
                        this.$Message.error('请选择添加类型！');
                    }
                    else {
                        this.$Message.error('填写内容有误，请检查后重新提交！');
                        
                    }
                })
                
            

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
             handleSubmit (formname) { //提交表单
             let isfile=this.formValidate.file
             
             this.$refs[formname].validate(async(valid) => {
               
                if (valid && isfile!=='') {                   
                    //输入数据类型拼接
                    let str = ''
                        for(let i=0;i<this.formValidate.intype.length;i++){
                            str += this.formValidate.intype[i]
                            if(i<this.formValidate.intype.length-1){
                                str += ','
                            }
                        }
                    //输入维度拼接
                        let dimstr = ''
                        for(let i=0;i<this.formValidate.dimlist.length;i++){
                            if(this.formValidate.dimlist[i].value !== ''){
                                dimstr +=this.formValidate.dimlist[i].value +','
                            }
                        }
                        dimstr = dimstr.substring(0,dimstr.length-1)
                    //上传数据
                     let adddata={
                            modelFile:this.formValidate.file,
                            name:this.formValidate.name,
                            taskTid:this.formValidate.mfunction,
                            uid:this.formValidate.mobject,
                            second:this.formValidate.dsecond,
                            dimShapeList:dimstr,
                            inputTypeIdList:str,
                            outputTid:this.formValidate.outtype
                    }
                    // console.log(adddata)
                    let res = await addModelApi(adddata)
                    // console.log(res)
                    if(res.type === "success"){
                        this.$Message.success('添加成功!');
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                }
                else if(isfile===''){
                    this.$Message.error('请选择上传文件！');
                }
                else {
                    this.$Message.error('填写内容有误，请检查后重新提交！');
                    
                }
             })
            },
            handleReset (formname) {
                this.$refs[formname].resetFields();
                this.$Message.info('填写数据清除');
            },
           
            handleAdd () {
                this.formValidate.dimlist.push({
                    value: '',
                })
            },
            handleRemove (index) {
                
                if(this.formValidate.dimlist.length>1){
               this.formValidate.dimlist.splice(index, 1)           
            }
            else{
                
                 this.$Message.error('至少保留一个输入数据类型');
            }
            },
            //输出类型选择框触发处理函数
            onchange(){
                if(this.formValidate.outtype.length<1){
                    return false
                }
                const data = this.formValidate.outtype  //当前选择数组
                this.$nextTick(()=>{    
                    //下一次选择时检查选择后的长度是否大于当前长度                            
                    if(this.formValidate.outtype.length<data.length){        
                        return true
                    }
                    this.$Message.error("只能选择一个输出类型！")
                    this.formValidate.outtype=data
                }
                )
            //    console.log(this.formValidate.outtype)
            }
        }
    }
</script>

<style>

</style>