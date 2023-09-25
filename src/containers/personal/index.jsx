// 个人中心
import React, { Component } from "react";
import { Result, WhiteSpace,List,Button,Modal } from 'antd-mobile';
import { connect } from 'react-redux'
import Cookies from "js-cookie";
import {resetUser} from '../../redux/action'

class Personal extends Component {
    logout = () => {
        Modal.alert('退出', '确认退出登录吗？', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                // 清除cookie中的userId
                Cookies.remove('userId')
                // 重置redux中的user状态
                this.props.resetUser()
            } },
          ])
    }
    render() {
        const {username,type,company,header,info,post,salary} = this.props.user
        return (
            <div>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} alt="header" />}
                    title={username}
                    message={company}
                />
                <List renderHeader={() => '相关信息'}>
                    <List.Item multipleLine>
                        <List.Item.Brief>职位：{post}</List.Item.Brief>
                        <List.Item.Brief>简介：{info}</List.Item.Brief>
                        {salary?<List.Item.Brief>薪资：{salary}</List.Item.Brief>:null}
                    </List.Item>
                </List>
                <WhiteSpace />
                <Button type="warning" onClick={this.logout}>退出登录</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {
        resetUser
    }
)(Personal)