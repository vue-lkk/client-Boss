import React, { Component } from "react";
import PropTypes from 'prop-types'
import { Card, WingBlank, WhiteSpace, PullToRefresh } from 'antd-mobile'
import { withRouter } from "react-router-dom";
import QueueAnim from 'rc-queue-anim';

class UserList extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired
    }

    state = {
        refreshing: false,
        down: true,
        height: document.documentElement.clientHeight,
    }

    render() {
        return (
            <PullToRefresh
                damping={80}
                ref={el => this.ptr = el}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    this.setState({ refreshing: true });
                    console.log('666')
                    setTimeout(() => {
                        this.setState({ refreshing: false });
                    }, 1000);
                }}
            >
                {/* 两翼留白 */}

                <WingBlank size="lg">
                    <QueueAnim delay={100} className="queue-simple" type='scale'>
                        {
                            this.props.list.map(user => (
                                <div key={user._id} >
                                    {/* 上下留白 */}
                                    <WhiteSpace size="sm" />
                                    <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                                        <Card.Header
                                            title={user.username}
                                            thumb={user.header ? require(`../../assets/images/${user.header}.png`) : null}
                                        // extra={<span style={{color:'green',fontSize:'0.1rem'}}>应聘者</span>}
                                        />
                                        <Card.Body>
                                            <div>职位: {user.post}</div>
                                            {user.company ? <div>公司：{user.company}</div> : null}
                                            {user.salary ? <div>月薪：{user.salary}</div> : null}
                                            <div>描述：{user.info}</div>
                                        </Card.Body>
                                        {/* <Card.Footer content="直聘" extra={<div>欢迎使用直聘App</div>} /> */}
                                    </Card>
                                    <WhiteSpace size="lg" />

                                </div>

                            ))
                        }
                    </QueueAnim>
                </WingBlank>
            </PullToRefresh>
        )
    }
}

export default withRouter(UserList)