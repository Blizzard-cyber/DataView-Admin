import serviceAxios from "../request";

/**
 * 获取首页各部分数据
 * GET
 * @param userId
 * @returns {Promise} res.data
 */
export const getHomeDataApi = (userId) => {
    return serviceAxios({
        url: "/index/count/" + userId,
        method: "get",
    });
}