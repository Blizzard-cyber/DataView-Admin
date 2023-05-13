<style>
	.collapsed-menu .ivu-icon-ios-arrow-down {
		display:none;
	}
	.ivu-layout-header {
		padding: 0;
		background:#0F193B;
	}
	.ivu-menu-dark {
		background:#0F193B;
	}
</style>
<style scoped>
    .layout{
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
	.layout-logo{
		color: #fff;
		height: 30px;
		line-height: 30px;
		font-size: 26px;
		position: relative;
		top: 15px;
        left: 25px;
	}
	.layout-nav{
		width: 420px;
		margin: 0 auto;
		margin-right: 20px;
	}
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
	.layout-footer-center{
		text-align: center;
	}
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" class="flex j-bt" theme="dark" active-name="1" >
                    <div class="layout-logo">Admin
                        <div style="display:inline-block">
                            <a><Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon></a>
                        </div>
                    </div>
                    <div>
                        <a @click="dataMap" v-if="this.auth == 1">
                            <Icon type="md-desktop" />
                            大屏数据
                        </a>
                        <Dropdown trigger="click" style="margin-left: 20px; margin-right:20px">
                            <a>
                                <Avatar style="color: #f56a00;background-color: #fde3cf">U</Avatar>
                                {{UserName}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>账户中心</DropdownItem>
                                <DropdownItem @click.native="logout">退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </Menu>
            </Header>
            <Layout style="min-height:calc( 100vh - 64px )">
                <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" style="background:#fff">
					<Menu ref="leftMenu" :accordion="true" @on-select="selectItem" :active-name="activName" @on-open-change="isCollapsed=false" theme="light" width="auto" :class="menuitemClasses" :open-names="openNames">
						<MenuItem name="0-1" to="/">
                            <Icon type="md-contacts" />
                            <span>工作平台</span>
                        </MenuItem>
						<Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                <span>模型管理</span>
                            </template>
                            <MenuItem name="1-1" to="/modelList">模型列表</MenuItem>
                            <MenuItem v-if="this.auth == 1" name="1-2" to="/modelAdd">模型添加</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                <span>设备管理</span>
                            </template>
                            <MenuItem name="2-1" to="/deviceList">设备列表</MenuItem>
                            <MenuItem v-if="this.auth == 1" name="2-2" to="/deviceAdd">设备添加</MenuItem>
                            
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-bulb"></Icon>
                                <span>模型训练</span>
                            </template>
                            <MenuItem name="3-1" to="/trainList">训练数据集</MenuItem>
                            <MenuItem name="3-2" to="/trainModel">模型训练</MenuItem>
                            
                        </Submenu>
                        <MenuItem  v-if="this.auth == 1" name="4-1" to="/display">
                            <Icon type="ios-jet" />
                            <span>展示班组</span>
                        </MenuItem>
                        <MenuItem v-if="this.auth == 1" name="5-1" to="/usrmanage">
                            <Icon type="ios-people" />
                            <span>用户管理</span>
                        </MenuItem>
                        
					</Menu>
				</Sider>
                <Layout style="padding: 15px">
					<router-view></router-view>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import util from '@/util';
import { mapMutations, mapGetters, mapState } from 'vuex';
    export default {
        data () {
            return {
                openNames: [],
                activName: '',
                isCollapsed: false
            }
        },
        created () {
            // this.loginName = util.storage.get(this.$config.KEY.CACHE_LOGIN_USER_NAME)

            if(this.$route.meta && this.$route.meta.order) {
                this.activName = this.$route.meta.order
                var subMenuName = this.$route.meta.order.split('-')[0]
                if(subMenuName !== "0") {
                    this.openNames.push(subMenuName)
                }
            }
        },
        watch: {
          isCollapsed(val) {
            if(val) {
              this.openNames = [];
              this.$nextTick(() => {
                this.$refs.leftMenu.updateOpened();
              })
            }
          }
        },
        computed: {
            ...mapState(["auth"]),
            ...mapGetters(["LoginToken","UserName"]),
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            ...mapMutations(["removeLoginToken","removeLoginUserName","removeLoginUserpwd"]),
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            selectItem(name) {
                this.isCollapsed = false
                if(name.startsWith('0')) {
                    this.openNames = [];
                    this.$nextTick(() => {
                        this.$refs.leftMenu.updateOpened();
                    })
                }
            },
            logout() {
                this.removeLoginToken()
                util.storage.remove('token')
                this.removeLoginToken()
                util.storage.remove('token')
                this.removeLoginUserName()
                this.removeLoginUserpwd()
                util.storage.remove(this.$config.KEY.CACHE_LOGIN_USER_NAME)
                util.storage.remove(this.$config.KEY.CACHE_LOGIN_PASS_PWD)
                this.$router.push("/login")
            },
            dataMap() {
                this.$router.push("/data")
            }
        }
    }
</script>

