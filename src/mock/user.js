import Mock from 'mockjs';

// Mock.mock('/modelList', { //输出数据
//     'userList|10': [{
//         'id|+1': 1,
//         'name': '@cword(15,20)',
//         'object': '@ctitle(2,3)', //4个汉字
//         'function': '@ctitle(4)',
//         'time': '@datetime(yyyy-MM-dd)'
//             //还可以自定义其他数据
//     }]
// })



// Mock.mock('/deviceList', { //输出数据
//     'userList|14': [{
//         'id|+1': 1,
//         "name": "@ctitle(2,3)",
//         'dtype': '@cname', //随机生成姓名
//         "btype": "@csentence(2,3)",
//         "time": "@datetime(yyyy-MM-dd)"
//             //还可以自定义其他数据
//     }]
// })

// Mock.mock(RegExp('/device/findSome' + '.*'), {
//     'userList': [{
//         'id': 999,
//         "name": "@ctitle(2,3)",
//         'dtype': '@cname', //随机生成姓名
//         "btype": "@csentence(2,3)",
//         "time": "@datetime(yyyy-MM-dd)"
//     }]
// })

// Mock.mock(RegExp('/model/findSome' + '.*'), {
//     'userList': [{
//         'id': 888,
//         "name": "@ctitle(2,3)",
//         'object': '@cname', //随机生成姓名
//         "function": "@csentence(2,3)",
//         "time": "@datetime(yyyy-MM-dd)"
//     }]
// })

// Mock.mock('/device/delete', 'delete', (req) => {
//     return {
//         flag: true
//     }
// })

// Mock.mock('/device/addDevice', 'post', (req) => {
//     return {
//         success: true
//     }
// })

// Mock.mock('/device/modify', 'post', (req) => {
//     return {
//         success: true
//     }
// })

// Mock.mock('/login', 'post', (req) => {
//     // eslint-disable-next-line standard/object-curly-even-spacing
//     const { password, username } = JSON.parse(req.body)
//     if (username === 'admin' && password === 'admin') {
//         return {
//             success: true
//         }
//     } else {
//         return {
//             success: false
//         }
//     }
// })