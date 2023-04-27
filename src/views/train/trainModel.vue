<template>
  <div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
      <FormItem label="模型文件" prop="file">
         <Upload action="//jsonplaceholder.typicode.com/posts/">
           <Button icon="ios-cloud-upload-outline">读取文件</Button>
        </Upload>
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
                    <Input type="text" v-model="item.value" placeholder="" style="width:250px"></Input>
                </Col>
                
                <Col span="" offset="1">
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
            
            <Select v-model="formValidate.intype" placeholder="请选择" filterable allow-create @on-create="handleCreate" style="width:250px">
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
                    <span>选择数据类型</span>
                </p>
                <Form :label-width="80">
                    <Row>
                        <Col span="12">
                            <FormItem label="数据名称" prop="dataname">
                                <Input v-model="addData.dataname" placeholder="" ></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="数据长度" prop="datalength">
                                <Input v-model="addData.datalength" placeholder="" ></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="数据描述" prop="datadescription">
                        <Input v-model="addData.datadescription" placeholder=""  type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    

                </Form>
                
            
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
    export default {
        data () {
            return {
                gindex: 1,
                isModal:false,//弹出框打开状态
                funcoption: [ //功能选项
                    {
                        value: 'op1',
                        label: 'op1'
                    },
                    {
                        value: 'op2',
                        label: 'op2'
                    },
                    {
                        value: 'op3',
                        label: 'op3'
                    }
                ],
                objectoption: [ //适用对象选项
                    {
                        value: 'op1',
                        label: 'op1'
                    },
                    {
                        value: 'op2',
                        label: 'op2'
                    },
                    {
                        value: 'op3',
                        label: 'op3'
                    }
                ],
                 intypeoption: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    }
                    
                ],
                outtypeoption: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    }
                    
                ],
                addData:{
                    dataname:'',
                    datalength:'',
                    datadescription:''
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
                    intype:'',
                    outtype:''
                },
                ruleValidate: {
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
                        { required: true, type: 'number', message: '请输入输入数据秒数', trigger: 'blur' },
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
        methods: {
             handleCreate (val) {
                this.intypeoption.push({
                    value: val,
                    label: val
                });
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
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