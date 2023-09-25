import React, { Component } from 'react'
import { List, InputItem, Radio, Button, Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import { register, errorMsg } from '../../redux/action.js'
import { Redirect } from 'react-router-dom'
import Logo from "../../components/logo";
import './index.less'


class Register extends Component {
    state = {
        username: '',  // 用户名
        password: '',  // 密码
        password2: '', // 登录密码
        type: 'dashen',// 用户类型
    }

    // 收集表单的回调函数(使用科里化),原生的要通过event.target.value
    handleRegisterFrom = (name) => {
        return (val) => {
            this.setState({ [name]: val })
            console.log(val)
            // 判断单选
            if (name === 'type') {
                // 获取单选框状态
                const { children } = val.target
                this.setState({ [name]: children === "大神" ? 'dashen' : 'laoban' })
            }
        }
    }
    // 点击按钮（注册）
    register = () => {
        // 调用注册异步action
        this.props.register(this.state)

    }

    // 跳转到登录页面
    toLogin = () => {
        // 跳转到登录
        this.props.history.replace('/login')
        // 重置错误提示
        this.props.errorMsg('')
    }


    render() {
        // 拿到用户类型
        const { type } = this.state
        // 拿到redux中 错误提示，跳转路径
        const { msg, redirectTo } = this.props.user


        /**
         * 
         */
        // 重定向的路由路径是否存在
        if(redirectTo) {
            return <Redirect to={redirectTo}/>
        }


        return (
            <div className='login_register'>
                <Logo name="注册"></Logo>

                {/* 收集注册表单 */}
                <List>
                    <div style={{ color: 'red', textAlign: 'center' }}>{msg ? msg : null}</div>
                    <InputItem type='text' placeholder='输入用户名' onChange={this.handleRegisterFrom('username')}>用户名：</InputItem>
                    <InputItem type='password' placeholder='输入密码' onChange={this.handleRegisterFrom('password')}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                    <InputItem type='password' placeholder='确认密码' onChange={this.handleRegisterFrom('password2')}>确认密码：</InputItem>
                    <List.Item>
                        <span>用户类型：</span>
                        <Radio checked={type === 'dashen'} onChange={this.handleRegisterFrom('type')}>大神</Radio>
                        <Radio checked={type === 'laoban'} onChange={this.handleRegisterFrom('type')}>老板</Radio>
                    </List.Item>
                    <List.Item>
                        <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;册</Button>
                        <Button size='middle' onClick={this.toLogin}>已注册</Button>
                    </List.Item>
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {
        register, // 注册-异步action
        errorMsg  // 错误提示-同步action
    }
)(Register)