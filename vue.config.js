const path = require('path')
// require('babel-polyfill')
// const {VueLoaderPlugin} = require("vue-loader")

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production'
  ? './'
  : './'
module.exports = {
  publicPath: '/',
  transpileDependencies: [
    'iview',
    'axios'
  ],
  lintOnSave: false,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // compress: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://43.248.188.73:11234', 
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // module:{
  //     rules:[
  //         {test:/\.css$/,loader:"style-loader!css-loader"},
  //         {test:/\.vue$/,loader:"vue-loader"},
  //         {test:/\.(jpg|png|jpeg|gif)$/,loader:"url-loader"}
  //     ]
  // },
  // plugins:[
  //   new VueLoaderPlugin()
  // ]
}
