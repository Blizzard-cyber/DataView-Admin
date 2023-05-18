import serviceAxios from "../request";

/**
 * 获取数据集列表
 * GET
 * 传入的参数通过字符串拼接
 * @param null
 * @returns {Promise} res.data
 */
export const getFileListApi = () => {
    return serviceAxios({
        url: "/sigFile/",
        method: "get",
    });
};

/**
 * 获取正在训练的任务列表
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getTrainListApi = () => {
    return serviceAxios({
        url: "/train/",
        method: "get",
    });
};

/**
 * 获取指定用户的模型列表，针对user级别用户
 * GET
 * 传入的参数通过字符串拼接
 * @param null
 * @returns {Promise} res.data
 */
export const getModelListForUserApi = (uid) => {
    return serviceAxios({
        url: "/model/byUid/" + uid,
        method: "get",
    });
};

/**
 * 数据集搜索
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const searchFileApi = (data) => {
    return serviceAxios({
        url: "/sigFile/search/",
        method: "post",
        data,
    })
};

/**
 * 删除数据集
 * DELETE
 * @param {String} modelId
 * @returns {Promise} res.data
 */
export const deleteFileApi = (fileId) => {
    return serviceAxios({
        url: '/sigFile/' + fileId,
        method: "delete",
    })
};

/**
 * 下载模型
 * GET
 * @param {String} modelId
 * @param {String} fileName
 * @returns {Blob} file
 */
// export const getFileNameApi = (modelId) => {
//   return serviceAxios({
//     url: '/model/url/' + modelId,
//     method: "get",
//   })
// };
// export const downloadModelApi = (fileName) => {
//   return serviceAxios({
//     url: '/modelFile/' + fileName,
//     method: "get",
//     responseType: "blob",

//   }
//   )
// };



/**
 * 数据集添加
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const addFileApi = (data) => {
    return serviceAxios({
        url: "/sigFile/",
        method: "post",
        data,
    });
}


/**
 * 添加模型输入/输出模型
 * POST
 * @param {FormData} data
 * @returns {Promise} res
 */
export const addINModelApi = (data) => {
    return serviceAxios({
        url: "/inputType/",
        method: "post",
        data,
    });
}
export const addOUTModelApi = (data) => {
    return serviceAxios({
        url: "/outputType/",
        method: "post",
        data,
    });
}