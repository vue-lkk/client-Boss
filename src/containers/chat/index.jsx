import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, Icon, InputItem, List, Grid, Popover,Toast } from 'antd-mobile'
import { sendMsg,readMsg } from '../../redux/action'
import './index.less'
import QueueAnim from 'rc-queue-anim';


class Chat extends Component {
    state = {
        content: '',
        isShow: false,
        issendTip: false,
        timer: ''
    }

    componentDidMount() {
        this.data = [
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙃', '😋',
            '🙉', '💥', '🐶', '💦', '🦊', '🐴', '🐼', '🐳', '🐌', '🍀',
            '💖', '💣', '🐄', '🍎', '🍑', '🍑', '🥝', '🍆', '🍌', '🍍',
        ]
        this.data = this.data.map((val) => ({ text: val, }));

        //初始显示列表聊天列表滚到底部
        window.scrollTo(0, document.body.scrollHeight)

        // // 点击进来的时候：将聊天对象发送过来的信息修改为已读
        // const from = this.props.match.params.userid
        // const to = this.props.user._id
        // this.props.readMsg(from,to)

    }
    componentDidUpdate() {
        // 更新聊天列表也滚到底部
        window.scrollTo(0, document.body.scrollHeight)
    }

    componentWillUnmount() {
        // 点击退出的时候：将聊天对象发送过来的信息修改为已读
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from,to)
    }

    // 发送按钮事件
    handleSend = () => {
        if(!this.state.content) {
            Toast.info('不能发送空白信息!', 1);
        }
        // 自己的id
        const from = this.props.user._id
        // 聊天对象的id
        const to = this.props.match.params.userid
        // 收集数据
        const content = this.state.content.trim()
        // 发送请求
        if (content) {
            this.props.sendMsg({ from, to, content })
        }
        // 清空
        this.setState({ content: '' })
        this.setState({ isShow: false })

    }

    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({ isShow })
        if (isShow) {
            //异步手动派发 resize事件,解决表情列表显示的 bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }

    render() {
        const { content } = this.state
        const { user } = this.props
        const { users, chatMsg } = this.props.chat
        // 自己id
        const meId = user._id
        // 如果还没有获取所有用户数据，直接不显示
        if (!users[meId]) {
            // 第一次显示空白，
            // 第二次数据请求回来了就会显示页面
            return null
        }
        // 聊天对象id
        const targetId = this.props.match.params.userid
        // 计算当前聊天的chat_id
        const chat_id = [meId, targetId].sort().join('_')
        // 对chat进行筛选
        const targetChat = chatMsg.filter(msg => msg.chat_id === chat_id)
        // 得到聊天对象的heade头像
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null

        return (
            <div>
                <NavBar
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >{users[targetId].username}</NavBar>
                <div className='chat-content'>
                    <List>
                    {/* <QueueAnim delay={300} className="queue-simple"> */}
                        {
                            targetChat.map(msg => {
                                if (meId === msg.to) { //对方发给我的
                                    {/* 聊天对象 */ }
                                    return (
                                        <List.Item
                                            key={msg._id}
                                            className='chat-me-left'
                                            multipleLine
                                            align='top'
                                            wrap
                                            thumb={targetIcon}>
                                            {msg.content}
                                        </List.Item>
                                    )
                                } else {
                                    {/* 自己 */ }
                                    return (
                                        <List.Item
                                            key={msg._id}
                                            className='chat-me' extra='我'
                                            multipleLine
                                            align='top'
                                            wrap>
                                            {msg.content}
                                        </List.Item>
                                    )

                                }
                            })
                        }
                    {/* </QueueAnim> */}
                    </List>
                </div>
                <div className='chat-input'>
                    <InputItem
                        placeholder='请输入'
                        value={content}
                        onChange={val => this.setState({ content: val })}
                        onFocus={() => this.setState({ isShow: false })}

                        extra={
                            <span>
                                <span className='small' onClick={this.toggleShow}>😋🐼😱</span>
                                <span className='send' onClick={this.handleSend}>发送</span>
                            </span>
                        } />
                    {
                        this.state.isShow ? (
                            <div className='grid-contanier'>
                                <Grid
                                    data={this.data}
                                    columnNum={6}
                                    carouselMaxRow={3}
                                    isCarousel={true}
                                    hasLine={false}
                                    onClick={item => { this.setState({ content: this.state.content + item.text }) }}
                                />
                            </div>
                        ) : null
                    }
                </div>
            </div >
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat
    }),
    {
        sendMsg,
        readMsg
    }
)(Chat)