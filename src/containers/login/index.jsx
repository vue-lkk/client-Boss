import React, { Component } from "react";
import Logo from "../../components/logo";
import { List, InputItem, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { login, errorMsg } from '../../redux/action.js'
import { Redirect } from 'react-router-dom'
import './index.less'


class Login extends Component {
    state = {
        username: '大神1', // 登录用户名
        password: '123',  // 登录密码
    }
    // 收集表单的回调函数(不使用科里化),原生的要通过event.target.value
    handleRegisterFrom = (name, val) => {
        this.setState({ [name]: val })
    }
    // 登录
    login = () => {
        // 调用异步登录action
        this.props.login(this.state)
    }
    // 跳转到注册页面
    toRegister = () => {
        // 跳转到注册
        this.props.history.replace('/register')
        // 重置同步action错误提示
        this.props.errorMsg('')
    }


    render() {
        const { msg, redirectTo } = this.props.user

        // 重定向的路由路径是否存在
        if(redirectTo) {
            return <Redirect to={redirectTo}/>
        }
        
        return (
            <div className="login_register">
                <Logo name="登录"></Logo>

                {/* 收集登录表单 */}
                <List>
                    <div style={{ color: 'red', textAlign: 'center' }}>{msg ? msg : null}</div>
                    <InputItem type='text' value={this.state.username} placeholder='输入用户名' onChange={val => this.handleRegisterFrom('username', val)}>用户名：</InputItem>
                    <InputItem type='password' value={this.state.password} placeholder='输入密码' onChange={val => this.handleRegisterFrom('password', val)}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                    <List.Item>
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;录</Button>
                        <Button size='middle' onClick={this.toRegister}>注&nbsp;&nbsp;册</Button>
                    </List.Item>
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {
        login,
        errorMsg
    }
)(Login)