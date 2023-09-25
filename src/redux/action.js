// 引入请求接口api
import {
    reqLogin,
    reqRegister,
    reqUpdate,
    reqUser,
    reqUserList,
    reqchatlist,
    reqchatread
} from '../api/index'
// 引入action常量
import {
    AUTH_SUCCESS, //注册、登录成功
    ERROR_MSG, //注册、登录请求出错
    RECEIVE_USER, // 接收用户
    RESET_USER,  // 重置用户
    RECEIVE_USER_LIST, // 所有老板/大神用户列表

    RECEIVE_CHAT_LIST, //接收所有相关消息列表
    RECEIVE_CHAT_ONE, //接收一条消息，
    READ_MSG // 查看过某个消息，设置为已读
} from './action_type'
// 《1》引入客户端IO对象
import io from 'socket.io-client'

// 同步action
// 注册/注册成功响应
const authSuccess = user => ({ type: AUTH_SUCCESS, data: user })
// 同步注册/登录错误消息
export const errorMsg = msg => ({ type: ERROR_MSG, data: msg })
// 接收完善用户信息
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
// 退出登录，重置用户
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
// 所有老板/大神用户列表
export const receiveUserList = (users) => ({ type: RECEIVE_USER_LIST, data: users })

// 接收消息列表
export const receiveChatList = ({ users, chatMsg,userId }) => ({ type: RECEIVE_CHAT_LIST, data: { users, chatMsg ,userId} })
//接收一条消息
export const receiveChatOne = ({chatMsg,userId}) => ({type:RECEIVE_CHAT_ONE,data:{chatMsg,userId}})
//查看过某个消息，设置为已读
export const msgRead = ({count,from,to}) => ({type:READ_MSG,data:{count,from,to}})






// 异步action
// 注册
export const register = (user) => { // 前台调用并传递表单数据
    const { username, password, password2, type } = user
    // 前端验证表单（同步）
    if (!username || !password) {
        return errorMsg(('用户名密码不能为空！'));
    } else if (password !== password2) {
        return errorMsg('注册密码不一致！')
    }

    // 后端验证表单（异步）
    return async dispatch => {
        //异步ajax请求,调用后端注册Api
        const response = await reqRegister({ username, password, type })
        const result = response.data

        //如果是正确的
        if (result.code === 0) {
            // 获取相关的聊天列表
            getChatList(dispatch,result.data._id)
            //分发注册成功的action
            dispatch(authSuccess(result.data))
        } else {
            //分发注册失败提示错误的action
            dispatch(errorMsg(result.msg))
        }
    }
}

// 登录
export const login = (user) => { // 前台调用并传递表单数据
    const { username, password } = user
    // 前端验证表单（同步）
    if (!username || !password) {
        return errorMsg(('用户名或密码不能为空！'));
    }

    // 后端验证表单（异步）
    return async dispatch => {
        //异步ajax请求,调用后端登录Api
        const response = await reqLogin({ username, password })
        const result = response.data

        //如果是正确的
        if (result.code === 0) {
            // 登录成功获取用户相关的聊天列表
            getChatList(dispatch,result.data._id)
            //分发登录成功的同步action
            dispatch(authSuccess(result.data))
        } else {
            //分发登录失败提示错误的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}

// 完善用户信息
export const update = (user) => {
    return async dispatch => {
        // 调用完善用户的Api获取后端返回的数据
        const respone = await reqUpdate(user)
        const result = respone.data
        // 获取成功
        if (result.code === 0) {
            // 更新成功，分发完善用户同步action
            dispatch(receiveUser(result.data))
        } else {
            // 更新失败，分发完善用户同步action
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户信息(自动登录)
export const getUser = () => {
    return async dispatch => {
        // 执行异步ajax请求
        const response = await reqUser()
        const result = response.data
        if (result.code === 0) {
            // 成功
            getChatList(dispatch,result.data._id)
            dispatch(receiveUser(result.data))
        } else {
            // 失败
            dispatch(resetUser(result.msg))
        }

    }
}


// 大神/老板用户列表
export const getList = (type) => {
    return async dispatch => {
        // 调用后端Api，获取数据
        const response = await reqUserList(type)
        const result = response.data
        if (result.code === 0) {
            // 调用大神/老板同步action
            dispatch(receiveUserList(result.data))
        }
    }
}


// 聊天相关的action

// 封装--单例对象 socket对象只创建一次
/**
 * 单例对象
 * 1.创建对象之前：判断对象是否已经创建，不存创建才去创建
 * 2.创建对象之后：保存对象 （1）保存在全局变 或者（2）保存在某一个对象
 */
function initIO(dispatch, userId) {
    // 1.创建对象之前：判断对象是否已经创建，只有还不存在创建才去创建
    if (!io.socket) {
        // 《2》连接服务器，得到代表连接的socket对象
        io.socket = io('ws://localhost:5000') // 创建之后保存在某一个对象
        // 《4》绑定订阅事件receiveMsg，接收服务器端发送过来的消息
        io.socket.on('receiveMsg', function (chatMsg) {
            console.log('浏览器端--收到--服务器的消息：', chatMsg)
            // 这里是服务器接收到消息会给所有的浏览器端发送消息，可能不是我需要的信息，
            // 所有需要判断 ，只有chatMsg数据的from/to与当前用户id相关的消息，才去分发action保存
            // 这里拿不到userId,需要传递
            if (userId === chatMsg.from || userId === chatMsg.to) {
                // 分发一条聊天消息到redux的同步action,
                // (前端拿到此消息，操作reudx保持此条消息)
                dispatch(receiveChatOne({chatMsg,userId}))
            }
        })
    }
}

// 获取消息列表数据，登录，注册，自动登录时都要调用
async function getChatList(dispatch,userId) {
    initIO(dispatch,userId)
    // 调用获取相关聊天列表Api
    const response = await reqchatlist()
    const result = response.data
    if (result.code === 0) {
        const { users, chatMsg } = result.data
        // 分发同步action,需要传递dispatch
        dispatch(receiveChatList({ users, chatMsg,userId }))
    }
}

// 发送消息
export const sendMsg = ({ from, to, content }) => {
    return dispatch => {
        // 在这里调用不太好
        // initIO()
        // 《3》发布事件sendMsg，向服务器端发送消息
        // (后端拿到消息，操作数据库保持此条消息)
        io.socket.emit('sendMsg', { from, to, content })
        console.log('浏览器端--发送消息到--服务器：', { from, to, content })
    }
}

//查看过某个消息，设置为已读
export const readMsg = (from,to) => {
    return async dispatch => {
        const respone = await reqchatread(from)
        const result = respone.data
        if(result.code === 0) {
            const count = result.data.readCount
            dispatch(msgRead({count,from,to}))
        }
    }
}
