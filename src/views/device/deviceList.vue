
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
               <Input v-model="value2" placeholder="设备类型" clearable/>
            </Col>
            <Col span="5">
                <Select v-model="value3" clearable placeholder="蓝牙类型">
                    <Option v-for="item in blueteethoption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </col>
            <Col span="5">
                <!-- <Input v-model="value4" placeholder="创建日期" clearable/> -->
                <DatePicker v-model="value4" type="date" placeholder="创建日期" show-week-numbers/>
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
                <span>修改用户</span>
            </p>
            <Form label-position="left"  :label-width="100">
                <template v-for="item of modalItem">
                    <FormItem 
                        :label="item.label"
                        v-if="!item.hide"
                        :key="item.label">
                        <Input 
                            :type="item.type || 'text'" 
                            v-model="item.value" 
                            style="width:300px" 
                            :disabled="item.label==='序号'||item.label==='创建时间'"/>
                    </FormItem>
                </template>
                    
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
import mockData from '@/mock/index.js'
export default {
        data () {
            return {
                isModal: false,
                value1: '',
                value2: '',
                value3: '',
                value4: '',

                blueteethoption:
                [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
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
                        key: 'dtype',
                        align: 'center'
                    },
                    {
                        title: '蓝牙类型',
                        key: 'btype',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '创建时间',
                        key: 'time',
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
                userList:[],
                modalItem: [
                    {
                        label: '序号',
                        value: '',
                    },
                    {
                        label: '设备名称',
                        value: '',
                    },
                    {
                        label: '设备类型',
                        value: ''
                    },
                    {
                        label: '蓝牙类型',
                        value: ''
                    },
                    {
                        label: '创建时间',
                        value: ''
                    },
                ],
                modifyIndex: 0,
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
                let str = ""
                if(this.value4!==''){
                    const year = this.value4.getFullYear()
                    const month = this.value4.getMonth()
                    const day = this.value4.getDate()
                    str = year + "-" + month + "-" + day
                }
                return str
            },
        },
        created () {
            this.getUserList()
        },
        methods: {
            getUserList() {
                this.$axios.get('/deviceList')
                .then(res => {
                    this.userList = res.data.userList
                }) 
            },
            //切换页码
            changePage(num) {
                this.currentPage = num -1;
            },
            //切换页数
            changePageSize(num) {
                this.currentPageSize = num;
            },
            showEditModal(userData,index) {
                //将modal状态变为edit修改用户信息
                this.modalStatus = 'edit'
                this.isModal = true
                //自动填入当前用户原有的信息
                this.modalItem[0].value = userData.id
                this.modalItem[1].value = userData.name
                this.modalItem[2].value = userData.dtype
                this.modalItem[3].value = userData.btype
                this.modalItem[4].value = userData.time
                this.modifyIndex = index     
            },
            cancel() {
                this.isModal = false
            },
            clickModalEvent() {
                let data = {
                    id:this.modalItem[0].value,
                    name:this.modalItem[1].value,
                    dtype:this.modalItem[2].value,
                    btype:this.modalItem[3].value,
                }
                this.$axios.post('/device/modify',data)
                .then(res=>{
                    if(res.data.success === true) {
                        this.userList[this.modifyIndex].name = this.modalItem[1].value
                        this.userList[this.modifyIndex].dtype = this.modalItem[2].value
                        this.userList[this.modifyIndex].btype = this.modalItem[3].value
                        this.$Message.success('修改成功');
                    } else {
                        this.$Message.error('修改失败')
                    }
                }).catch(err=>{
                    this.$Message.error(err.message);
                })
                this.isModal = false
            },
            remove (deleteId,index) {
                this.$axios.delete('/device/delete',{
                    data:{
                        id:deleteId
                    }
                }).then(res =>{
                    if(res.data.flag)
                    {
                        this.userList.splice(index, 1)
                        this.$Message.success('删除成功')
                    }    
                    else{
                        this.$Message.error(err.message);
                    }
                }).catch(err => {
                    this.$Message.error(err.message);
                })
            },
            searchItem() {
                this.$axios.get('/device/findSome',{
                    params:{
                        name:this.value1,
                        devType:this.value2,
                        bType:this.value3,
                        createDate:this.searchDate
                    }
                })
                .then(res => {
                    if(res.data.userList.length===0){
                        this.$Message.error('没有找到匹配的结果');
                        // this.$Message.error(res.error.message);
                    }
                    else
                        this.$Message.success('查找成功');
                    this.userList = res.data.userList
                }).catch(err => {
                    this.$Message.error(err.message);
                })
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