import React,{Component} from 'react'
import { Button } from 'antd-mobile'

export default class Notfound extends Component{
    render() {
        return (
            <div>
                <div style={{color:"red"}}>抱歉1F614.png页面404，找不到该页面</div>
                <Button 
                type='primary'
                onClick={() => this.props.history.replace('/')}
                >返回首页</Button>
            </div>
            
        )
    }
}