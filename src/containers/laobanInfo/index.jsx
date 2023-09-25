import React, { Component } from "react";
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import HeaderSelecter from "../../components/header_selecter";
import { connect } from 'react-redux'
import { update } from '../../redux/action'
import {Redirect} from 'react-router-dom'

class LaobanInfo extends Component {
    state = {
        header: '', // 头像名称
        post: '', // 职责岗位
        company: '', //公司名称
        salary: '', //工资
        info: '', //个人或项目介绍
    }
    // 收集用户完善的信息
    handleChange = (type, value) => {
        this.setState({
            [type]: value
        })
    }
    // 设置头像
    setHeader = (icon) => {
        this.setState({ header: icon })
    }
    // 保存用户信息
    save = () => {
        this.props.update(this.state)
    }
    render() {
        // 如果信息已经完善，自动重定向
        const {type,header} = this.props.user
        if(header) { 
            const path= type === 'dashen' ? '/dashen':'/laoban'
            return <Redirect to={path}/>
        }

        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelecter setHeader={this.setHeader} />
                <InputItem onChange={val => { this.handleChange('post', val) }}>招聘职位：</InputItem>
                <InputItem onChange={val => { this.handleChange('company', val) }}>公司名称：</InputItem>
                <InputItem onChange={val => { this.handleChange('salary', val) }}>职位薪资：</InputItem>
                <TextareaItem title="职位要求:" rows={3} onChange={val => { this.handleChange('info', val) }} />
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
)(LaobanInfo)