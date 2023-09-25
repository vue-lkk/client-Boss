// 信息列表
import React, { Component } from "react";
import { connect } from 'react-redux'
import './index.less'
import { List, Badge } from 'antd-mobile'
import { func } from "prop-types";

const Item = List.Item
const Brief = Item.Brief

// 对chatMsg按chat_id进行分组，并得到每个组的LastMsg（最后一条消息）组成的数组
// 1.找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id：lastMsg}
// 2.得到所有lastMsg的数组
// 3.对数组进行排序(按create_time降序)
function getLastMsgs(chatMsg, userId) {
    // 1.找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id：lastMsg}
    const lastMsgObjs = {}
    chatMsg.forEach(msg => {
        // 得到msg的聊天标识id
        const chatId = msg.chat_id
        // 获取已保存的当前组件的LastMsg 
        let lastMsg = lastMsgObjs[chatId]
        // 给每个聊天对象发过来的、未读的、msg添加一个unReadCount属性
        if (msg.to === userId && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }

        // 没有 (代表有多少组)
        if (!lastMsg) { // 当前的msg就是所在组的LastMsg
            lastMsgObjs[chatId] = msg
        } else { // 有 (代表每一组)
            // 累加unReadCount = 已经统计的 + 当前msg的
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            // 如果msg比LastMsg晚，覆盖之前的数据
            if (msg.create_time > lastMsg.create_time) {
                lastMsgObjs[chatId] = msg
            }
            // 累计并且保存到最新的LastMsg
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    });

    // 2.得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)

    // 3.对数组进行排序(按create_time降序)
    lastMsgs.sort((m1, m2) => {
        return m2.create_time - m1.create_time
    })
    // 4.返回
    return lastMsgs
}




class Message extends Component {
    render() {
        //得到 props中的 user 和 chat
        const { user } = this.props
        const { users, chatMsg } = this.props.chat
        // 得到当前用户的id
        const meId = user._id
        // 对chatMsg按chat_id进行分组
        const lastMsg = getLastMsgs(chatMsg, meId)
  
        return (
            <div className="message-container">
                <List style={{ margin: 0 }}>
                    {
                        lastMsg.map(msg => {
                            // 拿到聊天对象id 
                            const targetId = msg.from === meId ? msg.to : msg.from

                            return (
                                <Item
                                    extra={<Badge text={msg.unReadCount} />}
                                    thumb={users[targetId].header ? require(`../../assets/images/${users[targetId].header}.png`) : null}
                                    key={msg._id}
                                    onClick={() => this.props.history.push(`/chat/${targetId}`)}
                                >
                                    {users[targetId].username}
                                    <Brief>{msg.content}</Brief>
                                </Item>
                            )

                        })
                    }
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user, chat: state.chat }),
    {

    }
)(Message)



