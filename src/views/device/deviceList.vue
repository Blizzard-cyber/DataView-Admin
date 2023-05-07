
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>设备管理</BreadcrumbItem>
            <BreadcrumbItem>设备列表</BreadcrumbItem>
        </Breadcrumb>
        <Row class="rowbox" :gutter="16">
            <Col span="5" >
                <Input v-model="value1" placeholder="设备名称" clearable/>
            </Col>
            <Col span="5" >
               <Select v-model="value2" clearable placeholder="设备类型">
                    <Option v-for="item in deviceoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="5">
                <Select v-model="value3" clearable placeholder="蓝牙类型">
                    <Option v-for="item in blueteethoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </col>
            <Col span="5">
                <DatePicker v-model="value4" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="起始创建日期" show-week-numbers/>
            </Col>
            <Col span="4" style="padding: 0%;">
                <Button @click="searchItem" >查询</Button>
                <Button type="primary" to="/deviceAdd" style="margin-left:10px">新增</Button>
            </Col>
        </Row>
        <Table border :columns="columns6" :data="showData"></Table>
        <Page
            class="flex j-center"
            style="marginTop:20px"
            :total="userList.length"
            show-sizer
            show-elevator
            show-total
            :page-size-opts="[5,10,25,50,100]"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
        />
        <Modal 
            v-model="isModal"
            :styles="{top:'60px'}" >
            <p slot="header" style="font-size:16px">
                <span>修改设备</span>
            </p>
            <Form ref="modalItem" :model="modalItem" :rules="ruleValidate" :label-width="125">
                <FormItem label="序号" prop="id">
                    <Input v-model="modalItem.id" placeholder="" style="width:300px" disabled/>
                </FormItem>
                <FormItem label="设备名称" prop="name">
                    <Input v-model="modalItem.name" placeholder="" style="width:300px"/>
                </FormItem>
                <FormItem label="设备类型" prop="dtype">
                    <Select v-model="modalItem.devType" placeholder="请选择" style="width:300px">
                        <Option v-for="item in deviceoption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                    </Select>
                </FormItem>
                <FormItem label="蓝牙类型" prop="blueteeth">
                    <Select v-model="modalItem.bluType" placeholder="请选择" style="width:300px">
                        <Option v-for="item in blueteethoption" :value="item.value" :key="item.value">{{ item.label }}</Option> 
                    </Select>
                </FormItem>
                <FormItem label="输出数据类型" prop="outtype">
                    <Select v-model="modalItem.outtype" multiple placeholder="请选择" style="width:300px">
                        <Option v-for="item in outtypeoption" :value="item.value" :key="item.value">{{ item.label }}</Option>  
                    </Select> 
                </FormItem>
                <FormItem label="创建时间" prop="createDate">
                    <Input v-model="modalItem.createDate" placeholder="" style="width:300px" disabled/>
                </FormItem>
            </Form>
            <div slot="footer">
                <slot name="footer">
                    <Button type="text" size="large" @click="cancel">取消</Button>
                    <Button type="primary" size="large" @click="clickModalEvent">提交</Button>
                </slot>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getDeviceListApi, searchDeviceApi, deleteDeviceApi, modifyDeviceApi, getInputTypeApi, getOneInputTypeApi } from '../../network/api/deviceApi';
export default {
        data () {
            return {
                isModal: false,
                value1: '',
                value2: '',
                value3: '',
                value4: '',
                deviceoption:
                [
                    {
                        value: '心电设备',
                        label: '心电设备'
                    },
                    {
                        value: '腕带设备',
                        label: '腕带设备'
                    }
                ],
                blueteethoption:
                [
                    {
                        value: 'vivalink',
                        label: 'vivalink'
                    },
                    {
                        value: 'classic',
                        label: 'classic'
                    },
                    {
                        value: 'ble',
                        label: 'ble'
                    }
                ],
                columns6: [
                    {
                        title: '序号',
                        width: 90,
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '设备名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '设备类型',
                        key: 'devType',
                        align: 'center'
                    },
                    {
                        title: '蓝牙类型',
                        key: 'bluType',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight:"10px"
                                    },
                                    on: {
                                        click: () => {
                                            const userData = params.row
                                            this.showEditModal(userData,params.index)
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click:() => {
                                            this.$Modal.confirm({
                                                title: '系统提示',
                                                content: '删除后无法恢复，确定删除吗？',
                                                onOk: () => {
                                                    this.remove(params.row.id);
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                userList:[],
                outtypeoption:[],
                modalItem: {
                    id: '',
                    name: '',
                    devType: '',
                    bluType: '',
                    outtype:[],
                    createDate:''
                },
                ruleValidate: {
                    devType : [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    bluType : [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    createDate : [
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '设备名称不能为空', trigger: 'change' },
                    ],
                    outtype : [
                        {required: true, type:'array',min:1,message:'至少选择一个输出数据类型',trigger: 'change' }
                    ]
                },
                currentPage: 0,
                currentPageSize: 10,
            }
        },
        computed: {
            showData() {
                //再截取数据分页展示
                const startIndex = this.currentPage * this.currentPageSize;
                const endIndex = startIndex + this.currentPageSize;
                return this.userList.slice(startIndex, endIndex);
            },
            searchDate() {
                //时间选择器Date->str
                let str = ''
                if (this.value4 !== "") {
                    let date = new Date(this.value4);
                    let year = date.getFullYear();
                    let month = ("0" + (date.getMonth() + 1)).slice(-2);
                    let day = ("0" + date.getDate()).slice(-2);
                    let hours = ("0" + date.getHours()).slice(-2);
                    let minutes = ("0" + date.getMinutes()).slice(-2);
                    let seconds = ("0" + date.getSeconds()).slice(-2);
                    // Format string as "yyyy-MM-dd HH:mm:ss"
                    str = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                }
                return str
            },
        },
        created () {
            this.getUserList()
            this.getInputType()
        },
        methods: {
            async getUserList() {
                let res = await getDeviceListApi() //同步处理
                    if(res.type === 'success'){
                        this.userList = res.data
                    }
                    else{
                        this.$Message.error('获取选项列表失败');
                    }            
            },
            async getInputType(){
                let res = await getInputTypeApi()
                    if(res.type === 'success'){
                        let inputType = res.data
                        this.outtypeoption = []
                        inputType.forEach(element => {
                            this.outtypeoption.push({
                                value:element.id,
                                label:element.id
                            })
                        });
                    }
                    else{
                        this.$Message.error('获取设备输出类型失败！');
                    }
            },
            //切换页码
            changePage(num) {
                this.currentPage = num -1;
            },
            //切换页数
            changePageSize(num) {
                this.currentPageSize = num;
            },
            async showEditModal(userData) {
                this.isModal = true
                //根据id请求其对应设备的模型输入类型（输出数据类型）
                let res = await getOneInputTypeApi(userData.id)
                console.log(res);
                if(res.type==='success'){
                    this.modalItem.outtype = res.data
                }else {
                    this.$Message.error('获取当前设备输出数据类型失败!')
                }
                //自动填入当前用户原有的信息
                this.modalItem.id = userData.id
                this.modalItem.name = userData.name
                this.modalItem.devType = userData.devType
                this.modalItem.bluType = userData.bluType
                this.modalItem.createDate = userData.createDate
            },  
            cancel() {
                this.isModal = false
            },
            clickModalEvent() {
                this.$refs['modalItem'].validate(async (valid) => {
                    if (valid) {
                        let paramsdata = {
                            id:this.modalItem.id,
                            name:this.modalItem.name,
                            devType:this.modalItem.devType,
                            bluType:this.modalItem.bluType,
                            inputTypeIdList:this.modalItem.outtype
                        }
                        let res = await modifyDeviceApi(paramsdata)
                        if(res.type==='success'){
                            this.$Message.success('修改成功');
                            this.getUserList()
                        }else {
                            this.$Message.error('修改失败')
                        }
                        this.isModal = false
                    }else {
                        this.$Message.error('Fail!')
                    }
                })
                
            },
            async remove (deleteId) {
                let res = await deleteDeviceApi(deleteId)
                    if(res.type==="success"){
                        this.getUserList()
                        this.$Message.success('删除成功')
                    }    
                    else {
                        this.$Message.error("删除失败");
                    }
            },
            async searchItem() {
                let paramsdata = {
                    devName:this.value1,
                    devType:this.value2,
                    bluType:this.value3,
                    createDate:this.searchDate
                }
                let res = await searchDeviceApi(paramsdata)
                    if(res.data.length===0){
                        this.$Message.error('没有找到匹配的结果');
                    }
                    else {
                        this.$Message.success('查找成功');
                        this.userList = res.data   
                    }
            }
        }
    }
</script>
<style>
    .ivu-table-overflowX{ overflow-x: hidden;} 
    .rowbox{
        margin-bottom: 25px;
        margin-top: 25px;
        margin-left: 10px;
    }
</style>