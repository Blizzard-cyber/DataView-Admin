
<template>
  <div>
     <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>用户管理</BreadcrumbItem>
            
    </Breadcrumb>
    <Table :columns="columns" :data="users"></Table>
    <Modal v-model="modalVisible" title="Add User">
      <Form :model="form" :rules="rules">
        <FormItem label="Name" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="Email" prop="email">
          <Input v-model="form.email"></Input>
        </FormItem>
        <FormItem label="Role" prop="role">
          <Select v-model="form.role">
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="modalVisible = false">Cancel</Button>
        <Button type="primary" @click="handleSubmit">Submit</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Email',
          key: 'email'
        },
        {
          title: 'Role',
          key: 'role'
        },
        {
          title: 'Action',
          key: 'action',
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
                    this.handleEdit(params.index)
                  }
                }
              }, 'Edit'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleDelete(params.index)
                  }
                }
              }, 'Delete')
            ])
          }
        }
      ],
      users: [
        {
          name: 'John Doe',
          email: 'johndoe@example.com',
          role: 'admin'
        },
        {
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          role: 'user'
        }
      ],
      modalVisible: false,
      form: {
        name: '',
        email: '',
        role: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please enter a name', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter an email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: 'Please select a role', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleAdd () {
      this.modalVisible = true
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.users.push({
            name: this.form.name,
            email: this.form.email,
            role: this.form.role
          })
          this.modalVisible = false
          this.$Message.success('User added successfully')
        }
      })
    },
    handleEdit (index) {
      this.form = Object.assign({}, this.users[index])
      this.modalVisible = true
    },
    handleDelete (index) {
      this.$Modal.confirm({
        title: 'Confirm',
        content: 'Are you sure you want to delete this user?',
        onOk: () => {
          this.users.splice(index, 1)
          this.$Message.success('User deleted successfully')
        }
      })
    }
  }
}
</script>

<style>
</style>