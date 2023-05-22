
<style lang="less">
@import "./login.less";
</style>

<template>
	<div class="login">
		<div class="sign_canvas"></div>
		<div class="login-con">	
			<Card icon="log-in" title="欢迎使用" :bordered="false">	
				<div class="form-con">	
					<login-form @on-success-valid="handleSubmit"></login-form>	
					<!-- <p class="login-tip">用户名：admin 密码：admin</p>	 -->
				</div>	
			</Card>	
		</div>	
	</div>
</template>

<script>
import LoginForm from "@/components/login-form";
import { userLoginApi,userRegisterApi } from "../../network/api/loginApi";
import { mapMutations } from "vuex"
import util from "@/util";
export default {
	components: {
		LoginForm
	},
	// computed: {
	// 	...mapState(["loginUserName"])
	// },
	mounted () {
        // lottie.loadAnimation({
        //     container: document.querySelector('.sign_canvas'),
        //     enderer: 'svg',
        //     loop: true,
        //     autoplay: true,
        //     path: 'data7.json',
		// });
    },
	methods: {

		...mapMutations(["setUid","setLoginToken","setAuthority","setLoginUserName","setLoginUserpwd"]),
		async userLogin(userName, password){
			let res = await userLoginApi(userName, password)
				if(res.type==='success'){
					this.$Notice.success({
						title: "登录成功！"
					});
					let token = res.data.token
					let authority = res.data.authority // 1-管理员 0-用户	
					let uid = res.data.id
					util.storage.set('auth', authority);
					this.setAuthority(authority)
					util.storage.set('token', token);
					this.setLoginToken(token)
					util.storage.set('uid', uid);
					this.setUid(uid)

					this.setLoginUserName(userName)
					this.setLoginUserpwd(password)
					util.storage.set(this.$config.KEY.CACHE_LOGIN_USER_NAME, userName);
					util.storage.set(this.$config.KEY.CACHE_LOGIN_PASS_PWD, password);
					setTimeout(() => {
						this.$router.push("/");
					}, 300);
				} else {
					this.$Notice.error({
						title: "登录失败！",
						desc: "请输入正确的用户名和密码!"
					});
				}
		},
		async userRegister(username, password){
			let data = {
				username:username,
				password:password
			}
			let res = await userRegisterApi(data)
				if(res.type==='success'){
					this.$Notice.success({
						title: "注册成功！"
					});
				} else {
					this.$Notice.error({
						title: "注册失败！",
					});
				}
		},
		handleSubmit({ userName, password, func }) {
			if(func==="登录") this.userLogin(userName, password)
			else this.userRegister(userName, password)
		}
	}
};
</script>

<style>

</style>