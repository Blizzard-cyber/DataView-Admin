
<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>模型训练</BreadcrumbItem>
            <BreadcrumbItem>训练数据集</BreadcrumbItem>
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
                <FormItem 
                    :label="item.label"
                    v-for="item of modalItem" 
                    v-if="!item.hide"
                    :key="item.label">
                    <Input 
                        :type="item.type || 'text'" 
                        v-model="item.value" 
                        style="width:300px" />
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
import mockData from '@/mock/index.js'
export default {
        data () {
            return {
                isModal: false,
                value1: '',
                value2: '',
                value3: '',
                value4: '',

                objectoption:
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
                funcoption:
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
                        title: '唯一标识',
                        width: 90,
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '训练名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '模型选择',
                        key: 'object',
                        align: 'center'
                    },
                    {
                        title: '轮数',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '学习率',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '批大小',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '切片大小',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '是否监督',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '用户',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '任务类型',
                        key: 'function',
                        width: 150,
                        align: 'center',
                        
                    },
                    {
                        title: '输出类型',
                        key: 'function',
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
                                            this.showEditModal(userData)
                                        }
                                    }
                                }, '查看详情'),
                                // h('Button', {
                                //     props: {
                                //         type: 'error',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click:() => {
                                //             this.$Modal.confirm({
                                //                 title: '系统提示',
                                //                 content: '删除后无法恢复，确定删除吗？',
                                //                 onOk: () => {
                                //                     this.remove(params.index);
                                //                 }
                                //             });
                                //         }
                                //     }
                                // }, '删除')
                            ]);
                        }
                    }
                ],
                userList:[],
                modalItem: [
                    {
                        label: '姓名',
                        value: '',
                    },
                    {
                        label: '年龄',
                        value: '',
                    },
                    {
                        label: '性别',
                        value: ''
                    }
                ],
                // userData: {}
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
        },
        created () {
            this.getUserList()
        },
        methods: {
            getUserList() {
                this.$axios.get('/modelList')
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
            showEditModal(userData) {
                //将modal状态变为edit修改用户信息
                this.modalStatus = 'edit'
                this.isModal = true
                //自动填入当前用户原有的信息
                this.modalItem[0].value = userData.name
                this.modalItem[1].value = userData.age || ''
                this.modalItem[2].value = userData.gender ? "男" : "女" || ''
                this.userData = userData     
            },
            cancel() {
                this.isModal = false
            },
            clickModalEvent() {
                this.$Message.success('修改成功');
                this.isModal = false
            },
            remove (index) {
                this.userList.splice(index, 1);
                this.$Message.success('删除成功');
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