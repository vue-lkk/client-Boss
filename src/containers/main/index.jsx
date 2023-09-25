import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { getUser } from "../../redux/action";
import { NavBar } from 'antd-mobile'
import Cookies from 'js-cookie' // 可以操作前端cookie的对象 set()/get()/remove()
import './index.less'

import dashenInfo from "../dashenInfo";
import laobanInfo from "../laobanInfo";
import Laoban from "../laoban";
import Dashen from "../dashen";
import Message from "../message";
import Personal from "../personal";
import Navfooter from "../navFooter";
import Chat from '../chat'

class Main extends Component {

    componentDidMount() {
        // 获取cookie中的userId
        const userId = Cookies.get('userId')
        // 获取redux中的user
        const { user } = this.props
        if (userId && !user._id) {
            // 发送异步请求，获取user
            this.props.getUser()
        }
    }

    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'
        },
    ]

    /**
     * 1.实现自动登录：
     *  1.componentDidMount()
     *      登录过（cookie中有userId）,但没有登录（redux管理的user中没有_id）发送获取对应的user
     *  2.render()
     *      1)如果cookie中没有userId,直接重定向到login
     *      2)判断redux管理的user中是否有_id，如果没有，暂时不做任何显示
     *      3)如果有，说明当前已经登录，显示对应页面
     *      4)如果请求根路径，根据user的type和header来计算出一个重定向的路由路径，并自动重定向
    */
    render() {
        // (1)读取cookie中的userId,如果没有，自动重定向到登录界面
        // (2)读取cookie中的userId,如果有，<2-1>读取redux中user._id，如果_id没有值,返回null(不做任何显示)
        // (2)读取cookie中的userId,如果有，<2-2>读取redux中user._id，如果_id有值,显示对应的页面

        // 获取cookie中的userId
        const userId = Cookies.get('userId')
        // 获取redux中的user
        const { user,unReadCount } = this.props
        // 计算路径的函数
        function getRedirectTo(type, header) {
            let path = ''
            if (type === 'laoban') {
                path = '/laoban'
            } else {
                path = '/dashen'
            }
            if (!header) { // 如果没有头像信息
                path += 'info'
            }
            return path
        }

        // 情况(1) 如果userId没有值，自动重定向到登录页面
        if (!userId) {
            return <Redirect to='/login' />
        }
        
        // 情况(2-1) 如果userId有值，redux中user._id没有值,返回null(不在任何显示)，
        // render() --> componentDidMount()重新发请求,数据变化再次调用render()
        if (!user._id) {
            return null
        } else {
            // 情况(2-2)如果userId有值，redux中user._id有值,显示对应的页面
            // 获取路径
            let path = this.props.location.pathname
            // 如果是根路径
            if (path === '/') {
                // 情况(2-2-1)如果请求的是根路径,根据user的type和header来计算出一个重定向的路由路径，并自动重定向
                // 调用计算路径的函数
                path = getRedirectTo(user.type, user.header)
                // 重定向
                return <Redirect to={path} />
            }

        }

        // 获取路径
        const path = this.props.location.pathname
        // 筛选
        const isTrue = this.navList.filter(nav => nav.path === path)
        //console.log(isTrue) // 筛选出新数组 [{}]
        const currentNav = this.navList.find(nav => nav.path === path)
        //console.log(currentNav) // 查找到对应项返回 {}

        // 筛选出底部的导航项
        let newList = this.navList.filter(nav => user.type != nav.icon)

        return (
            <div>
                {isTrue.length > 0 ? <NavBar>{isTrue[0].title}</NavBar> : null}
                <div className={isTrue.length > 0?"content":''}>
                    <Switch>
                        {
                            this.navList.map((item, index) => <Route path={item.path} component={item.component} key={index}></Route>)
                        }
                        <Route path='/dashenInfo' component={dashenInfo}></Route>
                        <Route path='/laobanInfo' component={laobanInfo}></Route>
                        <Route path='/chat/:userid' component={Chat}></Route>
                        <Route component={Navfooter}></Route>
                    </Switch>
                </div>
                {isTrue.length > 0 ? <Navfooter navList={newList} unReadCount={unReadCount}></Navfooter> : null}
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user,unReadCount:state.chat.unReadCount }),
    {
        getUser //获取用户
    }
)(Main)