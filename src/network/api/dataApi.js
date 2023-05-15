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

/**
 * 获取指定时间班组信息
 * POST
 * @param {Date} date
 * @param {String} GroupId
 * @returns {Promise} res.data
*/
export const getClassByDateApi = (GroupId, date) => { 
    console.log(GroupId)
    return serviceAxios({
        url: "/member/details",
        method: "post",
        data: {
            date: date,
            groupIds: GroupId
        }
    });
}