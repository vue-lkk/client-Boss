import React, { Component } from 'react'
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'
import './index.less'

export default class HeaderSelecter extends Component {
    // props类型限制
    static propTypes = {
        setHeader:PropTypes.func.isRequired
    }
    
    state = {
        icon:null //初始化头像
    }

    constructor(props) {
        super(props)
        // 初始化拿到所有头像
        this.headerList = []
        for (let i = 0; i < 20; i++) {
            this.headerList.push({
                text: '头像' + (i + 1),
                icon: require(`./images/头像${i + 1}.png`) // 不能使用import
            })
        }
    }
    
    // 选择头像
    changeHeader = (el, index) => {
        // 将头像传递给父组件
        this.props.setHeader(el.text)
        // 修改头像
        this.setState({icon:el.icon})
    }

    render() {
        // 判断是否选择头像
        const {icon} = this.state
        const listHeader = !icon?'请选择头像':(<div className='icon-header'>已选择：<img src={icon} alt="" /></div>)

        return (
            <div className='header'>
                <List renderHeader={() => listHeader}>
                    <Grid
                        data={this.headerList}
                        columnNum={4}
                        hasLine={false}
                        isCarousel
                        onClick={this.changeHeader}
                        carouselMaxRow={3}
                    ></Grid>
                </List>
            </div>
        )
    }
}