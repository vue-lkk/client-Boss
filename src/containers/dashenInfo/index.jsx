import React, { Component } from "react";
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import HeaderSelecter from "../../components/header_selecter";
import { connect } from 'react-redux'
import { update } from '../../redux/action'
import {Redirect} from 'react-router-dom'

class DashenInfo extends Component {

    state = {
        header: '', // 头像名称
        post: '', // 职责岗位
        info: '', //个人或项目介绍
    }

    // 收集用户完善的信息
    handleChange = (type, value) => {
        this.setState({
            [type]: value
        })
    }

    // 需要子传父，拿到头像信息，等会发送请求需要
    setHeader = (icon) => {
        this.setState({ header: icon })
    }

    // 保存用户信息
    save = () => {
        this.props.update(this.state)
    }
    
    render() {
        // 如果信息已经完善，自动重定向
        const { type, header } = this.props.user
        if (header) {
            const path = type === 'dashen' ? '/dashen' : '/laoban'
            return <Redirect to={path} />
        }

        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                {/* 头像组件 */}
                <HeaderSelecter setHeader={this.setHeader} />
        
                <InputItem onChange={val => { this.handleChange('post', val) }}>求职岗位：</InputItem>
                <TextareaItem title="个人介绍：" rows={3} onChange={val => this.handleChange('info', val)} />
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {
        update
    }
)(DashenInfo)