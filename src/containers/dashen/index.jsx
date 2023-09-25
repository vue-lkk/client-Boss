// 大神列表
import React,{Component} from "react";
import {connect} from 'react-redux'
import UserList from "../../components/userList";
import { getList } from "../../redux/action";

class Dashen extends Component{
    componentDidMount() {
        this.props.getList('laoban')
    }
    render() {
        return (
            <div>
                <UserList list={this.props.list}/>
            </div>
        )
    }
}

export default connect(
    state => ({list:state.list}),
    {
        getList
    }
)(Dashen)