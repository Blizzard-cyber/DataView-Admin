import serviceAxios from "../request";

/**
 * 获取模型列表
 * GET
 * 传入的参数通过字符串拼接
 * @param null
 * @returns {Promise} res.data
 */
export const getModelListApi = () => {
    return serviceAxios({
        url: "/model/detail",
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
 * 模型搜索
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const searchModelApi = (data) => {
    return serviceAxios({
        url: "/model/search/",
        method: "post",
        data,
    })
};

/**
 * 删除模型
 * DELETE
 * @param {String} modelId
 * @returns {Promise} res.data
 */
export const deleteModelApi = (modelId) => {
    return serviceAxios({
        url: '/model/' + modelId,
        method: "delete",
    })
};

/**
 * 下载模型
 * GET
 * @param {String} modelId
 * @returns {Blob} file
 */

// export const getFileNameApi = (modelId) => {
//   return serviceAxios({
//     url: '/model/url/' + modelId,
//     method: "get",
//   })
// };
export const downloadModelApi = (modelId) => {
  return serviceAxios({
    url: '/model/download/' + modelId,
    method: "get",
    responseType: "blob",

  }
  )
};

/**
 * 获取输入/输出模型
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getINModelApi = () => {
    return serviceAxios({
        url: "/inputType/",
        method: "get",
    });
}
export const getOUTModelApi = () => {
    return serviceAxios({
        url: "/outputType/",
        method: "get",
    });
}

/**
 * 模型添加
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const addModelApi = (data) => {
    return serviceAxios({
        url: "/model/",
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

/**
 * 获取任务类型
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getTaskTypeApi = () => { 
    return serviceAxios({
        url: "/taskType/",
        method: "get",
    });
}