

<h1 align="center">DataView Admin</h1>

### 技术栈

- Vue版本：2.6.10
- 路由管理：vue-router
- 状态管理：vuex
- HTTP请求工具：axios
- UI组件库：View UI
- 可视化：ECharts ，AntV G2引擎

##  Develop-bash

``` bash
#拉取远端仓库代码
git clone https://github.com/Blizzard-cyber/DataView-Admin.git

#拉取到本地后查看main分支（主分支）内容为模板内容
.....
#编写代码
.....
#编写代码完成

#创建自己的分支
git checkout -b <yourBranchName>

#提交过程
#提交所有更改
git add .

#commit
git commit -m "提交说明"

#push
git push origin <yourBranchName>

#合并代码到master分支
#切换到master分支
git  checkout main

#pull master分支的状态
git pull origin main

#合并自己分支到master
git  merge <yourBranchName>

#可检查状态
git status

#push到远端
git push origin main
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
- [G2 可视化引擎](https://antv-g2.gitee.io/zh/)
- [echart](https://www.echartsjs.com/zh/index.html)

## License

[MIT License](https://github.com/SaberInoryKiss/iview-saber/blob/master/LICENSE)
