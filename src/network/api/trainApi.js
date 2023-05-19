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
 * 获取数据集列表详情
 * GET
 * 传入的参数通过字符串拼接
 * @param null
 * @returns {Promise} res.data
 */
export const getFileListDetailApi = () => {
    return serviceAxios({
        url: "/sigFile/detail",
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
 * 获取正在训练的任务列表详情
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getTrainListDetailApi = () => {
    return serviceAxios({
        url: "/train/detail",
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
 * 获得属于用户的全部信号文件信息
 * GET
 * 传入的参数通过字符串拼接
 * @param {FormData} userId
 * @returns {Promise} res.data
 */
export const getUserFileApi = (userId) => {
    return serviceAxios({
        url: "/sigFile/byUid/" + userId,
        method: "get",
    })
};

/**
 * 请求模型训练，创建一个训练任务
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const addTrainApi = (data) => {
    return serviceAxios({
        url: "/train/",
        method: "post",
        data,
    })
};

/**
 * 删除数据集
 * DELETE
 * @param {String} fileId
 * @returns {Promise} res.data
 */
export const deleteFileApi = (fileId) => {
    return serviceAxios({
        url: '/sigFile/' + fileId,
        method: "delete",
    })
};

/**
 * 下载数据集
 * GET
 * @param {String} fileId
 * @returns {Promise} res.data
 */
export const downLoadSigFileApi = (fileId) => {
    return serviceAxios({
        url: '/sigFile/download/processed/' + fileId,
        method: "get",
        responseType: 'blob'
    })
};

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