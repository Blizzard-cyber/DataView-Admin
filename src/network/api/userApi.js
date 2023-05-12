import serviceAxios from "../request";

/**
 * 获取所有用户信息
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getUsersApi = () => {
    return serviceAxios({
        url: "/user/",
        method: "get",
    });
}

/**
 * 搜索用户
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const searchUserApi = (searchName) => {
    return serviceAxios({
        url: "/user/search/" + searchName,
        method: "get",
    });
}

/**
 * 删除用户
 * DELETE
 * @param {String} userId
 * @returns {Promise} res.data
 */
export const deleteUserApi = (userId) => {
    return serviceAxios({
        url: '/user/' + userId,
        method: "delete",
    })
};

/**
 * 添加用户
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const addUserApi = (data) => {
    return serviceAxios({
        url: '/user/',
        method: "post",
        data
    });
};

/**
 * 修改用户信息
 * PUT
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const modifyUserApi = (data) => {
    return serviceAxios({
        url: "/user/info",
        method: "put",
        data,
    })
};