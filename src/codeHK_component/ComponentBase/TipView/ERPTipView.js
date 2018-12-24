/**
 * Created by Cwwng on 2018/2/1.
 */

import React from 'react';
import {Modal} from 'antd';

export default class ERPTipView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            tipsText: '',
        };
    }

    show(tip) {

        this.setState({
            visible: true,
            tipsText: tip
        });
    }

    render() {
        return (
            <Modal
                title="提示"
                visible={this.state.visible}
                onOk={this.handleOk}
                zIndex={8000}
                onCancel={this.handleCancel}
            >
                <p>{this.state.tipsText}</p>
            </Modal>
        );
    }

    show(tip) {
        this.setState({
            visible: true,
            tipsText: tip
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
}