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
        <FormItem label="设备类型" prop="devType">
            <Select v-model="formValidate.devType" placeholder="请选择" style="width:250px">
                <Option v-for="item in deviceoption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
            </Select>
        </FormItem>
        <FormItem label="蓝牙类型" prop="bluType">
            <Select v-model="formValidate.bluType" placeholder="请选择" style="width:250px">
                <Option v-for="item in blueteethoption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
            </Select>
        </FormItem>
        <FormItem label="输出数据类型" prop="outtype">
            <Select v-model="formValidate.outtype" multiple filterable placeholder="请选择"  style="width:250px">
                <Option v-for="(item,index) in outtypeList" :value="item.id" :key="index">
                    <span>{{item.name}}</span>
                    <span style="float:right;margin-right: 10%;color:#ccc">{{item.batchSize}}</span>
                </Option>
            </Select> 
            <Button type="warning" style="margin-left:10px"  @click="isModal2=true">输出数据类型详情</Button>
            <Modal 
                v-model="isModal2"
                fullscreen
                footer-hide>
                <Table border :columns="columns6" :data="showData"></Table>
                <Page
                    class="flex j-center"
                    style="marginTop:20px"
                    :total="outtypeList.length"
                    :current="this.currentPage"
                    show-sizer
                    show-elevator
                    show-total
                    :page-size="currentPageSize"
                    :page-size-opts="[5,10,25,50,100]"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                />
            </Modal>
        </FormItem>
        <FormItem label="缺少输出数据类型？">
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
    import { getInputTypeApi, addDeviceApi, addInputTypeApi, deleteInputTypeApi, getDeviceListApi } from '../../network/api/deviceApi'
    export default {
        data () {
            return {
                isModal:false,//弹出框打开状态
                isModal2:false,
                currentPage: 1,
                currentPageSize: 5,
                userList:[],
                deviceoption:[],
                blueteethoption:[],
                outtypeoption: [],
                outtypeList: [],
                columns6: [
                    {
                        title: '序号',
                        width: 90,
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '输出类型',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '数据长度',
                        key: 'batchSize',
                        align: 'center'
                    },
                    {
                        title: '数据描述',
                        key: 'desc',
                        // width: 150,
                        align: 'center',
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        width: 200,
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click:() => {
                                            this.$Modal.confirm({
                                                title: '系统提示',
                                                content: '只能删除未使用的数据类型且删除后无法恢复，确定删除吗？',
                                                onOk: () => {
                                                    this.remove(params.row.id,params.index);
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                addData:{
                    dataname:'',
                    datalength:'',
                    datadescription:''
                },
                formValidate: {
                    name: '',
                    devtype: '',
                    bluType: '',
                    outtype:[]
                },
                ruleValidate: { 
                    name: [
                        { required: true, message: '设备名称不能为空', trigger: 'blur' },
                    ],
                    devType: [
                        { required: true, message: '设备类型不能为空', trigger: 'change' }
                    ],               
                    bluType: [
                        { required: true, message: '蓝牙类型不能为空', trigger: 'change' }
                    ],
                    outtype: [
                        { required: true, type:'array', min:1, message: '至少选择一个输出数据类型', trigger: 'change' }
                    ]
                },
                addValidate: {
                    dataname: [
                        { required: true, message: '添加的数据名称不能为空', trigger: 'blur'}
                    ],
                    datalength: [
                        { required: true, type: 'number', message: '数据长度必填且是整数', trigger: 'blur' },
                        { type: 'number', min:1,max: 1000, message: '数据长度范围为1-1000', trigger: 'blur' }
                    ],  
                    datadescription: [
                        { required: true, message: '添加的数据描述不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        computed:{
            showData() {
                //再截取数据分页展示
                const startIndex = (this.currentPage - 1)* this.currentPageSize;
                const endIndex = startIndex + this.currentPageSize;
                return this.outtypeList.slice(startIndex, endIndex);
            }
        },
        created () {
            this.getUserList()
            this.getInputType()
        },
        methods: {
            changePage(num) {
                this.currentPage = num;
            },
            //切换页数
            changePageSize(num) {
                this.currentPageSize = num;
            },
            async getUserList() {
                let res = await getDeviceListApi() //同步处理
                    if(res.type === 'success'){
                        this.userList = res.data
                        let op1 = "devType"
                        let op2 = "bluType"
                        this.getOptionList(op1);
                        this.getOptionList(op2);
                    }
                    else{
                        this.$Message.error('获取选项列表失败');
                    }            
            },
            //将表中数据选项转换为数组
            getOptionList(op) {
                //将userList中的devType/bluType的值提取出来放入数组
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
                if(op === "devType"){
                    this.deviceoption = arr3
                }
                else if(op === "bluType"){
                    this.blueteethoption = arr3
                }
            },
            async getInputType(){
                let res = await getInputTypeApi()
                    if(res.type === 'success'){
                        this.outtypeList = res.data
                    }
                    else{
                        this.$Message.error('获取设备输出类型失败！');
                    }
            },
            async remove(deleteId,row){
                let res = await deleteInputTypeApi(deleteId)
                if(res.type==="success"){
                    this.getInputType()
                    //删除的是当前页剩余的最后一条数据时，跳转到上一页
                    let cur = (this.currentPage - 1) * this.currentPageSize + row
                        if(row === 0 && (cur === this.userList.length - 1) && this.currentPage !== 1){
                            this.currentPage = this.currentPage - 1
                        }
                        this.userList.splice(cur, 1)
                    this.$Message.success('删除成功')
                }    
                else {
                    this.$Message.error("删除失败");
                }
            },
            handleSubmit (formData) {
                this.$refs['formValidate'].validate(async (valid) => {
                    if (valid) {
                        let inputTypeIdList = formData.outtype.join(',')
                        let paramsdata = {
                            name:formData.name,
                            devType:formData.devType,
                            bluType:formData.bluType,
                            inputTypeIdList:inputTypeIdList
                        }
                        let res = await addDeviceApi(paramsdata)
                        if (res.type==='success'){
                            this.$Message.success("添加设备成功")
                            // this.handleReset('formValidate')
                        }else {
                            this.$Message.error(res.message);
                        }
                    } else {
                        this.$Message.error('您提交的修改数据有误，请检查修改后再提交');
                    }
                })
            },
            handlerAdd (data) {
                this.$refs['addData'].validate(async (valid)=>{
                    if (valid){
                        let paramsdata = {
                            name:data.dataname,
                            batchSize:data.datalength,
                            desc:data.datadescription,
                        }
                        let res = await addInputTypeApi(paramsdata)
                            if(res.type === "success"){
                                this.$Message.success("添加输出类型成功")
                                this.handleReset('addData')
                                this.getInputType()
                                this.isModal = false
                            }else {
                                this.$Message.error(res.message);
                            }
                    } else {
                        this.$Message.error('您提交的数据有误，请检查修改后再提交');
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