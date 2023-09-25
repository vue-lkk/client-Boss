// 老板列表
import React,{Component} from "react";
import {connect} from 'react-redux'
import UserList from "../../components/userList";
import { getList } from "../../redux/action";


class Laoban extends Component{
    componentDidMount() {
        this.props.getList('dashen')
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
)(Laoban)