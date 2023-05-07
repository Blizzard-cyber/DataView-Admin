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
    url: "/model/", 
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
 * @param {String} fileName
 * @returns {Blob} file
 */
export const getFileNameApi = (modelId) => {
  return serviceAxios({
    url: '/model/url/' + modelId,
    method: "get",
  })
};
export const downloadModelApi = (fileName) => {
  return serviceAxios({
    url: '/modelFile/' + fileName,
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