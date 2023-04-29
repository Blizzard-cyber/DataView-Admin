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
            <Select v-model="formValidate.outtype" placeholder="请选择" filterable allow-create @on-create="handleCreate" style="width:250px">
                <Option v-for="item in outtypeoption" :value="item.value" :key="item.value">{{ item.label }}</Option>  
            </Select> 
        </FormItem>
        <FormItem label="缺少数据类型？">
            <Button type="warning" @click="isModal=true">点我添加</Button>
            <Modal
                v-model="isModal"
                :styles="{top:'60px'}">

                <p slot="header" style="font-size:16px">
                    <span>添加数据类型</span>
                </p>
                <Form :label-width="80" ref="addData" :model="addData" :rules="addValidate">
                    <Row>
                        <Col span="12">
                            <FormItem label="数据名称" prop="dataname">
                                <Input v-model="addData.dataname" placeholder="" ></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="数据长度" prop="datalength">
                                <Input v-model="addData.datalength" number placeholder="" ></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="数据描述" prop="datadescription">
                        <Input v-model="addData.datadescription" placeholder="" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                </Form>
                <Button slot="footer" type="primary" @click="handlerAdd(addData)">确认添加</Button>
                <Button slot="footer" @click="handleReset('addData')" style="margin-left: 8px">清除内容</Button>
            </Modal> 
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit(formValidate)">确认提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">清除内容</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
    import mockData from '@/mock/index.js'
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
                formValidate: {
                    name: '',
                    dtype: '',
                    blueteeth: '',
                    outtype:''
                },
                ruleValidate: { 
                    name: [
                        { required: true, message: '设备名称不能为空', trigger: 'blur' },
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
                },
                addValidate: {
                    dataname: [
                        { required: true, message: '添加的数据名称不能为空', trigger: 'blur'}
                    ],
                    datalength: [
                        { required: false, type: 'number', message: '数据长度为整数', trigger: 'blur' },
                        { type: 'number', min:1,max: 1000, message: '数据长度范围为1-1000', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
             handleCreate (val) {
                this.outtypeoption.push({
                    value: val,
                    label: val
                });
            },
            handleSubmit (formData) {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let data = {
                            name:formData.name,
                            dtype:formData.dtype,
                            blueteeth:formData.blueteeth,
                            outtype:formData.outtype
                        }
                        console.log(data);
                        this.$axios.post('/device/addDevice',data)
                        .then(res=>{
                            if(res.data.success === true){
                                this.$Message.success("添加设备成功")
                            }
                        })
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })

            },
            isExist(p){
                return p.label==this.addData.dataname
            },
            handlerAdd (data) {
                this.$refs['addData'].validate((valid)=>{
                    if (valid){
                        console.log(this.outtypeoption.findIndex(this.isExist));
                        if(this.outtypeoption.findIndex(this.isExist)===-1){
                            this.outtypeoption.push({
                                value:data.dataname,
                                label:data.dataname
                            })
                            this.isModal = false
                            this.formValidate.outtype = data.dataname
                            this.$refs['addData'].resetFields()
                            console.log(this.formValidate.outtype);
                        } else {
                            this.$Message.error('已存在该数据类型');
                        }
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