import serviceAxios from "../request";

/**
 * 获取班组信息
 * GET
 * @param null
 * @returns {Promise} res.data
 */
export const getClassApi = () => {
    return serviceAxios({
        url: "/member/",
        method: "get",
    });
};