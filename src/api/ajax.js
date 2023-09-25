/*
使用axios 封装的ajax 请求函数函数返回的是promise 对象
*/
import axios from 'axios'

/**
 * @param {请求路径} url 
 * @param {请求参数} data 
 * @param {请求方法} method 
 * @returns axios.get(url) / axios.post(url,data)
 */
export default function ajax(url='',data={},method='GET') {
    if(method === 'GET'){
        // 准备url query 参数数据
        let dataStr = '';
        // 拿到所有key值遍历拼接成 username='小红帽'&password='123'&
        Object.keys(data).forEach(key => {
            dataStr += `${key}=${data[key]}&`
        })
        // 利用substring截取字符串,不包括结尾
        if(dataStr) {
            dataStr = dataStr.substring(0,dataStr.length-1)
            //数据拼接字符串
            url = url + '?' +  dataStr
        }
        // 返回get请求函数
        return axios.get(url)
    }else{
        // 返回post请求函数
        return axios.post(url,data)
    }
}
