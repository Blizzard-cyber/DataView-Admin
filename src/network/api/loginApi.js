import serviceAxios from "../request";

/**
 * 用户登录
 * POST
 * 传入的参数通过字符串拼接
 * @param null
 * @returns {Promise} res.data
 */
export const userLoginApi = (userName, password) => {
    return serviceAxios({
        url: '/user/login/' + userName + '/' + password,
        method: "post",
    });
};

/**
 * 用户登录
 * POST
 * @param {FormData} data
 * @returns {Promise} res.data
 */
export const userRegisterApi = (data) => {
    return serviceAxios({
        url: '/user/register',
        method: "post",
        data
    });
};