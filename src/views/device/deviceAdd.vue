<template>
  <div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>设备管理</BreadcrumbItem>
            <BreadcrumbItem>设备添加</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
        <FormItem label="设备名称" prop="name">
            <Input v-model="formValidate.name" placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="设备类型" prop="dtype">
            <Input v-model="formValidate.dtype" placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="蓝牙类型" prop="blueteeth">
            <Select v-model="formValidate.blueteeth" placeholder="请选择" style="width:250px">
                <Option v-for="item in blueteethoption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
            </Select>
        </FormItem>
        <FormItem label="输出数据类型" prop="outtype">
            
            <Select v-model="formValidate.outype" placeholder="请选择" filterable allow-create @on-create="handleCreate" style="width:250px">
                <Option v-for="item in outypeoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                
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
                isModal:false,//弹出框打开状态
                blueteethoption: [ //功能选项
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
                outypeoption: [
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
                formValidate: {
                    name: '',
                    dtype: '',
                    blueteeth: '',
                    outtype:''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '模型名称不能为空', trigger: 'blur' },
                        // { type: 'string', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    
                    dtype: [
                        { required: false, trigger: 'blur' }
                    ],
                    
                    blueteeth: [
                        { required: false,  trigger: 'change' }
                    ],
                    outtype: [
                        { required: false, trigger: 'change' }
                    ]
                    
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
            }
           
            
        }
    }
</script>

<style>

</style>