<template>
    <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
        <FormItem
                v-for="(item, index) in formDynamic.items"
               
                :key="index"
                :label="'Item '+index"
                :prop="'items.' + index + '.value'"
                :rules="{required: true, message: 'Item ' + index +' can not be empty', trigger: 'blur'}">
            <Row>
                <Col span="18">
                    <Input type="text" v-model="items.value" placeholder="Enter something..."></Input>
                </Col>
                <Col span="4" offset="1">
                    <Button @click="handleRemove(index)">Delete</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>
            <Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>
            <Button @click="handleaxios" >点击</Button>
        </FormItem>
        
    </Form>
    
</template>
<script>
import{getUserInfo,searchModel} from '../../network/api/modelApi'
    export default {
        data () {
            return {
                restext:'',
                index: 1,
                formDynamic: {
                    items: [
                        ""
                    ]
                }
            }
        },
        methods: {

            handleaxios(){
                //将formDynamic中的value值取出来，用逗号隔开拼接
                let str = ''
                for(let i = 0;i<this.formDynamic.items.length;i++){
                    if(this.formDynamic.items[i] !== ''){

                    
                    str += this.formDynamic.items[i]+','
                    }
                }
                //去掉最后一个逗号
                str = str.substring(0,str.length-1)
                //调用接口
                console.log(str)
                console.log(this.formDynamic.items)
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
                
                this.formDynamic.items.push("");
                console.log(this.formDynamic.items.length)
                console.log(this.formDynamic.items)
            },
            handleRemove (index) {
                
                //将对应的对象移除
                this.formDynamic.items.splice(index,1)
               
            }
        }
    }
</script>
