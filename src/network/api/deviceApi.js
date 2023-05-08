import serviceAxios from "../request";

/**
 * 获取设备列表
 * GET
 * 传入的参数通过字符串拼接
 * @param null
 * @returns {Promise} res.data
 */
export const getDeviceListApi = () => {
    return serviceAxios({
        url: "/dev/",
        method: "get",
    });
};

/**
 * 设备搜索
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const searchDeviceApi = (data) => {
    return serviceAxios({
        url: "/dev/search",
        method: "post",
        data,
    })
};

/**
 * 修改设备信息
 * PUT
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const modifyDeviceApi = (data) => {
    return serviceAxios({
        url: "/dev/",
        method: "put",
        data,
    })
};

/**
 * 删除设备
 * DELETE
 * @param {String} deviceId
 * @returns {Promise} res.data
 */
export const deleteDeviceApi = (deviceId) => {
    return serviceAxios({
        url: '/dev/' + deviceId,
        method: "delete",
    })
};

/**
 * 删除某个设备输出类型（即模型输入类型）
 * DELETE
 * @param {String} inputTypeId
 * @returns {Promise} res.data
 */
export const deleteInputTypeApi = (inputTypeId) => {
    return serviceAxios({
        url: '/inputType/' + inputTypeId,
        method: "delete",
    })
};

/**
 * 获取设备输出类型（即模型输入类型）
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getInputTypeApi = () => {
    return serviceAxios({
        url: "/inputType/",
        method: "get",
    });
}

/**
 * 获取<单个>设备的输出类型（即模型输入类型）
 * GET
 * @param {String} deviceId
 * @returns {Promise} res.data
 */
export const getOneInputTypeApi = (deviceId) => {
    return serviceAxios({
        url: "/dev/inputTypeId/" + deviceId,
        method: "get",
    });
}

/**
 * 添加设备输出数据类型
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const addInputTypeApi = (data) => {
    return serviceAxios({
        url: "/inputType/",
        method: "post",
        data,
    });
}

/**
 * 设备添加
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const addDeviceApi = (data) => {
    return serviceAxios({
        url: "/dev/",
        method: "post",
        data,
    });
}