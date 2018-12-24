/**
 * Created by Cwwng on 2018/2/1.
 */

import React from 'react';
import { Spin } from 'antd';
import "./style.less"

export default class ERPSpinView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    render() {
        let content;

        if (this.state.loading) {
            content = <div className="erp_spin_view">
                <Spin className="Spin" spinning={this.state.loading}/>
            </div>;
        }
        else {
            content = null;
        }

        return (
            content
        );
    }

    // show dismiss
    show(){
        this.setState({ loading: true });
    }

    dismiss(){
        this.setState({ loading: false });
    }
}