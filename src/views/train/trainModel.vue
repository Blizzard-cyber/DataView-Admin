<template>
  <div>
    <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
        <FormItem label="训练名称name" prop="tobject">
            <Select v-model="formValidate.tobject" placeholder="请选择" style="width:250px">
                <Option v-for="item in objectoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="选择数据集sigFileIdList" prop="batchsize">
            <Input v-model="formValidate.batchsize" number placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="训练对象uid" prop="tobject">
            <Select v-model="formValidate.tobject" placeholder="请选择" style="width:250px">
                <Option v-for="item in objectoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="模型选择method" prop="modelopt">
            <Select v-model="formValidate.modelopt" placeholder="请选择" style="width:250px">
                <Option v-for="item in modeloption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
            </Select>
        </FormItem>
        <FormItem label="训练轮数epoch" prop="trounds">
            <Input v-model="formValidate.trounds" number placeholder="" style="width:250px"></Input>
        </FormItem>
        
        <FormItem label="学习率learningRate" prop="rate">
            <Input v-model="formValidate.rate" number placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="批大小batchSize" prop="batchsize">
            <Input v-model="formValidate.batchsize" number placeholder="" style="width:250px"></Input>
        </FormItem>
        <FormItem label="切片大小second" prop="batchsize">
            <Input v-model="formValidate.batchsize" number placeholder="" style="width:250px"></Input>
        </FormItem>
         <FormItem label="是否监督isSupervised" prop="batchsize">
            <Input v-model="formValidate.batchsize" number placeholder="" style="width:250px"></Input>
        </FormItem>
         <FormItem label="任务类型taskTid" prop="batchsize">
            <Input v-model="formValidate.batchsize" number placeholder="" style="width:250px"></Input>
        </FormItem>
         <FormItem label="输出类型outputTid" prop="batchsize">
            <Input v-model="formValidate.batchsize" number placeholder="" style="width:250px"></Input>
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
                modeloption: [ //模型选择
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
                objectoption: [ //训练对象选项
                    {
                        value: 'common',
                        label: 'common'
                    },
                    {
                        value: '对象1',
                        label: '对象1'
                    },
                    {
                        value: '对象2',
                        label: '对象2'
                    }
                ],
                formValidate: {
                    tobject: 'common',
                    modelopt: '',
                    trounds:undefined,
                    rate:undefined,
                    batchsize:undefined,
                    
                },
                ruleValidate: {
                    tobject:[
                        { required: true, message: '请选择训练对象', trigger:'change'}
                    ],
                    modelopt:[
                        { required: true, message: '请选择用于训练的模型', trigger:'change'}
                    ],
                    trounds: [
                        { required: true, type: 'number', message: '请填写训练轮数', trigger: 'blur' },
                        { type: 'number', min:1,max: 10000, message: '训练轮数范围为1-10000', trigger: 'blur' }
                    ],
                    rate: [
                        { required: true, type: 'number', message: '请填写学习率', trigger: 'blur' },
                        { type: 'number', min:0,max: 0.8, message: '学习率范围为0-0.8', trigger: 'blur' }
                    ],
                    batchsize: [
                        { required: true, type: 'number', message: '请填写batchsize', trigger: 'blur' },
                        { type: 'number', min:1,max: 126, message: 'batchsize范围为1-126', trigger: 'blur' }
                    ],
                    
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
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