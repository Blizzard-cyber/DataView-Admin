

<h1 align="center">DataView Admin</h1>

### 技术栈

- Vue版本：2.6.10
- 路由管理：vue-router
- 状态管理：vuex
- HTTP请求工具：axios
- UI组件库：View UI
- 可视化：ECharts 

##  文件树

``` bash
│  vue.config.js     //Vue项目配置文件
│  
├─public             //公共资源文件夹
│  │  favicon.ico
│  │  index.html
│  │  wave.json
│  │  
│  └─dataview  //数据大屏源代码部分
│              
└─src
    │  App.vue   //项目主组件
    │  main.js    //项目入口文件
    │  
    ├─assets   //资源文件
    │  ├─css   
    │  ├─font
    │  └─images
    │              
    ├─components  //封装后的组件
    │  │  line.vue    //csv预览折线图封装组价
    │  │  Pline.vue    //训练中间状态折线图组件
    │  │  
    │  ├─error-page    //错误页面（403,404）
    │  │      403.vue
    │  │      404.vue
    │  │      500.vue
    │  │      back-btn-group.vue
    │  │      error-content.vue
    │  │      error.less
    │  │      
    │  └─login-form   //登录框
    │          index.js
    │          login-form.vue
    │          
    ├─config   //全局设置
    │      index.js
    │      key.js
    │      
    ├─mock     //Mock接口
    │      index.js
    │      user.js
    │      
    ├─network    //接口文件
    │  │  request.js    //axios请求封装以及拦截器配置
    │  │  
    │  ├─api             //接口书写文件
    │  │      dataApi.js
    │  │      deviceApi.js
    │  │      homeApi.js
    │  │      loginApi.js
    │  │      modelApi.js
    │  │      trainApi.js
    │  │      userApi.js
    │  │      
    │  └─config         //请求基本配置（baseUrl）
    │          index.js
    │          
    ├─router         //路由设置    
    ├─store          //Vuex状态管理
    ├─util         //主要写了关于存储的函数（状态持久化）
    │      
    └─views           //页面组件
        │  home.vue      //首页
        │  main.vue      //主页面配置
        │  
        ├─dataview           //数据大屏部分
        │      data.vue        //数据大屏页面
        │      display.vue      //班组页面
        │      subtable.vue      //班组信息子组件
        │      
        ├─device
        │      deviceAdd.vue     //设备添加
        │      deviceList.vue     //设备列表
        │      
        ├─login
        │      login.css
        │      login.less
        │      login.vue        //登录页面
        │      
        ├─modell
        │      modelAdd.vue     //模型添加
        │      modelList.vue      //模型列表
        │      
        ├─train
        │      training.vue       //正在训练的任务
        │      trainList.vue    //数据集
        │      trainLog.vue         //训练中间状态
        │      trainModel.vue      //训练参数填写
        │      
        └─usr
                usr.vue        //用户管理
                
```

## 使用

### clone
```bash
$ git clone https://github.com/Blizzard-cyber/DataView-Admin.git
```
### yarn
```bash
$ yarn install
$ yarn serve
```
### or npm
```
$ npm install
$ npm run serve
```
## 参考

- [View UI](http://v4.iviewui.com/docs/introduce)
- [echart](https://www.echartsjs.com/zh/index.html)

## License

[MIT License](https://github.com/SaberInoryKiss/iview-saber/blob/master/LICENSE)
