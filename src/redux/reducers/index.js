// 包含多个用于生成新的state的reducer函数的模块
import { combineReducers } from 'redux'
// 引入action常量
import {
    AUTH_SUCCESS, //注册、登录成功
    ERROR_MSG, //注册、登录请求出错
    RECEIVE_USER, // 接收用户
    RESET_USER,  // 重置用户
    RECEIVE_USER_LIST, // 所有老板/大神用户列表

    RECEIVE_CHAT_LIST, //接收所有相关消息列表
    RECEIVE_CHAT_ONE, //接收一条消息
    READ_MSG // 查看过某个消息，设置为已读
} from '../action_type'

// ---------------产生user状态的reducer-------------
// 数据初始化
let initUser = {
    username: '', //用户名
    type: '', //类型
    msg: '', //错误提示信息
    redirectTo: '' //需要自动重定向的路由路径
}

/*
redirectTo跳转情况：
用户界面路由
    如果是dashen: 跳转到 /dashen
    如果是laoban: 跳转到 /laoban
用户信息完善界面路由
    如果是dashen: 跳转到 /dashenInfo
    如果是laoban: 跳转到 /laobanInfo
判断是否已经完善信息？查看数据库中user.header是否有值
判断用户是什么类型？查看数据库中user.type
*/

/**
 * 
 * @param {用户类型} type 
 * @param {头像} header 
 * @returns 返回path路径
 */
function getRedirectTo(type, header) {
    let path = ''
    if (type === 'laoban') {
        path = '/laoban'
    } else {
        path = '/dashen'
    }

    // 如果没有头像信息，说明用户还没有完善信息
    if (!header) { 
        path += 'info'
    }
    return path
}

// 用户注册、登录信息reducer
function user(state = initUser, action) {
    const { type, data } = action
    switch (type) {
        case AUTH_SUCCESS: // data 是user,登录注册成功
            return { ...data, redirectTo: getRedirectTo(data.type, data.header) };
        case ERROR_MSG:  // data 是msg，登录注册失败
            return { ...state, msg: data };
        case RECEIVE_USER:  // data 是user,完善用户信息
            return data 
        case RESET_USER:  // data 是msg， 重置错误提示，退出登录
            return { ...initUser, msg: data };
        default:
            return state;
    }
}

// ---------------产生老板/大神列表状态的reducer---------------
let initList = []
function list(state = initList, action) {
    const { type, data } = action
    switch (type) {
        case RECEIVE_USER_LIST:
            return data;
        default:
            return state;
    }
}


// ---------------产生聊天列表状态的reducer---------------
let initchat = {
    users: {}, // 所有用户信息的对象
    chatMsg: [], //当前用户与所有相关聊天对象的数据
    unReadCount:0 //总的未读数量
}
function chat(state = initchat, action) {
    const { type, data } = action
    switch (type) {
        case RECEIVE_CHAT_LIST:  //相关聊天列表
            const { users, chatMsg, userId } = data
            return {
                users,
                chatMsg,
                unReadCount: chatMsg.reduce((perTotal, msg) => {
                    return perTotal + (!msg.read && msg.to === userId ? 1 : 0)
                },0)
            }
        case RECEIVE_CHAT_ONE: // 一条聊天信息
            return {
                users: state.users,
                chatMsg: [...state.chatMsg, data.chatMsg],
                unReadCount: state.unReadCount + (!data.chatMsg.read && data.chatMsg.to === data.userId ? 1 : 0)
            }
        case READ_MSG:
            const { from, to, count } = data
            // 错误，不能这样写
            state.chatMsg.forEach(msg => {
                if (msg.from === from && msg.to === to && !msg.read) {
                    msg.read = true
                }
            })
            return {
                users: state.users,
                chatMsg:state.chatMsg.map(msg => {
                    if (msg.from === from && msg.to === to && !msg.read) {
                        return {...msg,read:true}
                    }else{
                        return msg
                    }
                }),
                unReadCount:state.unReadCount-count,
            }
        default:
            return state;
    }
}


// 返回合并后的reducer函数
export default combineReducers({
    user,
    list,
    chat
})