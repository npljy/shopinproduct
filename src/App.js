import React, { Component } from 'react';
import { Layout,Button } from 'antd';
import './style/index.less';
const { Content, Footer } = Layout;
window.routerUrl = `http://${window.location.host}/app/`

var sourceWindow;

class App extends Component {
    constructor(props){
        super(props)

    }

    componentDidMount() {
        window.addEventListener('message', this.receiveMessage);
        
    }

    render() {
        return <div className='wep-app'>
            {this.props.children}
        </div>
    }

    // receiveMessage
    receiveMessage(message) {
        if(message.data.custData) {
            sourceWindow = message.source;
        }
    }

    buttonTaped() {
        window.parent.postMessage({custData:'子工程调用主工程传参'},'*');
    }
}
export default App;
