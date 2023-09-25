/*包含所有action的type常量名称的模块*/
// 操作user相关
export const AUTH_SUCCESS = "auth_success" //注册、登录成功

export const ERROR_MSG = "error_msg" //注册、登录请求出错

export const RECEIVE_USER = 'receive_user' // 接收完善用户信息

export const RESET_USER = 'reset_user' // 退出登录，重置用户

export const RECEIVE_USER_LIST = 'receive_user_list' //所有老板/大神用户列表

// 操作聊天list相关
export const RECEIVE_CHAT_LIST = 'receive_chat_list' //接收所有相关消息列表

export const RECEIVE_CHAT_ONE = 'receive_chat_one' //接收一条消息

export const READ_MSG = 'read_msg' // 查看过某个消息，设置为已读


