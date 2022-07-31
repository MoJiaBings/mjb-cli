// 通过 axios 处理请求
const axios = require('axios')

// axios 拦截器 ，数据相应后 返回 data 中的内容
axios.interceptors.response.use(res => {
    return res.data;
})

/**
 * 获取版本信息
 * @returns Promise
 */
async function  getTagList() {
    return axios.get(`https://api.github.com/repos/MoJiaBings/my-webpack-temp/tags`)
}

module.exports = {
    getTagList
}



