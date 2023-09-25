import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class Navfooter extends Component {
    // 限制
    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }

    render() {
        // 获取路径
        const path = this.props.location.pathname
        const {navList,unReadCount} = this.props
        return (
            <TabBar
                unselectedTintColor="#000" //未选中的字体颜色
                tintColor="#1cae82" //选中的字体颜色
                tabBarPosition="bottom"//tabbar 位置
                //barTintColor='#ccc' //tabbar 背景色
                
            >
                {
                    navList.map((nav) => (
                        <TabBar.Item
                            key={nav.title}
                            badge={nav.path === '/message'?unReadCount:0}
                            title={nav.title}
                            icon={{ uri: require(`./images/${nav.icon}.png`) }} //默认展示图片
                            selectedIcon={{ uri: require(`./images/${nav.icon}-selected.png`) }} // 选中后的展示图片
                            selected={path === nav.path} // 是否选中
                            onPress={() => {  // 点击触发，需要自己改变组件
                                this.props.history.replace(nav.path)
                            }}
                        />
                    ))
                }
            </TabBar>
        )
    }
}

export default withRouter(Navfooter) //让非路由组件可以访问到路由组件的api