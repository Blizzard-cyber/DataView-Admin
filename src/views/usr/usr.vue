
<template>
  <div>
     <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>用户管理</BreadcrumbItem>       
    </Breadcrumb>
    <Row class="rowbox" :gutter="16">
        <Col span="5" style="margin-left: 20%;">
            <Input v-model="searchName" placeholder="用户名称" clearable/>
        </Col>
        <Col span="3" style="padding: 0%;">
            <Button type="primary" @click="searchItem" >查询用户</Button>
        </Col>
        <Col span="3" style="padding: 0%;">
            <Button type="warning" @click="isModal1=true" >添加用户</Button>
        </Col>
    </Row>
    <Modal 
        v-model="isModal1"
        :styles="{top:'60px'}" >
        <p slot="header" style="font-size:16px">
            <span>添加用户</span>
        </p>
        <Form ref="modalItem" :model="modalItem" :rules="ruleValidate" :label-width="100">
            <FormItem label="用户名" prop="username">
                <Input type="text" v-model="modalItem.username" placeholder="" style="width:300px" />
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model="modalItem.password" placeholder="" style="width:300px"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <slot name="footer">
                <Button type="text" size="large" @click="isModal1=false">取消</Button>
                <Button type="primary" size="large" @click="clickModalEvent">提交</Button>
            </slot>
        </div>
    </Modal>
    <div>
        <Table border :columns="columns" :data="showData"></Table>
        <Spin size="large" fix v-if="isLoading"></Spin>
    </div>
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
      v-model="isModal2"
      :styles="{top:'60px'}" >
      <p slot="header" style="font-size:16px">
          <span>修改用户信息</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="125">
        <FormItem label="序号" prop="id">
          <Input v-model="form.id" style="width:300px" disabled></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" style="width:300px"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" style="width:300px"></Input>
        </FormItem>
        <FormItem label="身份" prop="role">
          <Input v-model="form.role" style="width:300px" disabled></Input>
        </FormItem>
        <FormItem label="创建日期" prop="createDate">
          <Input v-model="form.createDate" style="width:300px" disabled></Input>
        </FormItem>
        
      </Form>
      <div slot="footer">
          <slot name="footer">
              <Button type="text" @click="isModal2=false">取消</Button>
              <Button type="primary" @click="handleSubmit(form)">提交</Button>
          </slot>
      </div>
      
    </Modal>
  </div>
</template>

<script>
import { getUsersApi,deleteUserApi,searchUserApi,addUserApi,modifyUserApi} from "../../network/api/userApi";
export default {
  data () {
    return {
      isLoading:false,
      userList:[],
      searchName:"",
      isModal1:false,
      isModal2:false,
      currentPage: 0,
      currentPageSize: 10,
      modalItem: {
          username: '',
          password: '',
      },
      form: {
          id:'',
          username:'',
          password:'',
          role:'',
          createDate:'',
      },
      columns: [
        {
          title: '序号',
          key: 'id',
          align: 'center',
        },
        {
          title: '用户名',
          key: 'username',
          align: 'center',
        },
        {
          title: '身份',
          key: 'role',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'createDate',
          align: 'center',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    const userData = params.row
                    this.showEditModal(userData)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ruleValidate: {
          username : [
              {required: true, message: '用户名不能为空', trigger: 'blur'},
              {type:'string',min:4,message: '用户名至少为4位', trigger: 'blur'}
          ],
          password : [
              {required: true, message: '密码不能为空', trigger: 'blur'},
              {type:'string',min:4,message: '密码至少为4位', trigger: 'blur'}
          ],
      },  
      rules: {
          username : [
              {required: true, message: '用户名不能为空', trigger: 'blur'},
              {type:'string',min:4,message: '用户名至少为4位', trigger: 'blur'}
          ],
          password : [
              {required: false, trigger: 'blur'},
              {type:'string',min:4,message: '密码至少为4位', trigger: 'blur'}
          ],
      }    
    }
  },
  computed:{
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
    async getUserList(){
        this.isLoading = true
        let res = await getUsersApi() //同步处理
        if(res.type === 'success'){
            this.userList = res.data
            this.userList.forEach(element => {
                if (element.authority===1) element.role = "admin"
                else element.role = "user"
            });
        }
        else{
            this.$Message.error('获取用户列表失败');
        } 
        this.isLoading = false
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
        this.isModal2 = true
        //自动填入当前用户原有的信息
        this.form.id = userData.id
        this.form.username = userData.username
        this.form.role = userData.role
        this.form.createDate = userData.createDate
    },  
    handleSubmit (formData) {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              let paramsdata = {
                  id:formData.id,
                  username:formData.username,
              }
              if(this.form.password !==''){
                  paramsdata["password"]=this.form.password
              }
              let res = await modifyUserApi(paramsdata)
              if (res.type==='success'){
                  this.$Message.success("修改用户信息成功")
                  this.isModal2 = false
              }else {
                  this.$Message.error(res.data.message);
              }
              
          } else {
              this.$Message.error('修改失败！');
          }
      })
    },
    handleDelete (index) {
      this.$Modal.confirm({
        title: '系统提示',
        content: '删除后无法恢复，确定删除吗？',
        onOk: () => {
          this.remove(index);
        }
      })
    },
    async clickModalEvent() {
      this.$refs['modalItem'].validate(async (valid) => {
        if (valid) {
            let paramsdata = {
                username:this.modalItem.username,
                password:this.modalItem.password,
                imgFile:"",
            }
            let res = await addUserApi(paramsdata)
            if(res.type==='success'){
                this.$Message.success('添加成功');
                this.getUserList()
            } else {
                this.$Message.error('添加失败')
            }
            this.isModal1 = false
          } else {
              this.$Message.error('Fail!')
          }
    })
    },
    async remove (deleteId) {
      this.isLoading = true
      let res = await deleteUserApi(deleteId)
      if(res.type==="success"){
          this.getUserList()
          this.$Message.success('删除成功')
      }    
      else {
          this.$Message.error("删除失败");
      }
      this.isLoading = false
    },
    async searchItem() {
      if(this.searchName === ""){
          this.getUserList()
      }
      else {
          let res = await searchUserApi(this.searchName)
            if(res.data.length===0){
                this.$Message.error('没有找到匹配的结果');
                this.getUserList()
            }
            else {
                this.$Message.success('查找成功');
                this.userList = res.data   
                this.userList.forEach(element => {
                  if (element.authority===1) element.role = "admin"
                  else element.role = "user"
                });
            }
      }
      
    }
  }
}
</script>

<style>
.demo-spin-container{
    	display: inline-block;
        position: relative;
        border: 1px solid #eee;
        overflow-y: auto;
    }
    
</style>