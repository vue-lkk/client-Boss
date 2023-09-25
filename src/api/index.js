// 包含了n个请求接口
import ajax from "./ajax";

// 注册接口
export const reqRegister = (user) => ajax('/register',user,'POST')

// 登录接口
export const reqLogin = ({username,password}) => ajax('/login',{username,password},'POST')

// 完善用户信息接口
export const reqUpdate = (user) => ajax('/update',user,'POST')

// 获取大神/老板用户列表信息
export const reqUser = () => ajax('/user')

// 获取用户列表
export const reqUserList = (type) => ajax('/list',{type})

// 聊天
// 获取当前用户所有相关聊天信息列表
export const reqchatlist = () => ajax('/chatlist')

// 修改chat指定消息为已读
export const reqchatread = (from) => ajax('/chatread',{from},'POST')
