import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import './index.less'

export default class Logo extends Component {
    render() {
        const { name } = this.props
        return (
            <div>
                {/* NavBar导航组件 */}
                <NavBar>直聘</NavBar>

                {/* 3D水珠 */}
                <div className="war_water">
                    <div className="water">{name}</div>
                    <div className="water"></div>
                    <div className="water"></div>
                    <div className="water"></div>
                </div>
            </div>
        )
    }
}