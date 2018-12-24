/**
 * Created by Cwwng on 2018/2/1.
 */

import React from 'react';
import SpinView from './SpinView/ERPSpinView';
import TipView from './TipView/ERPTipView';
import Analysis from '../utils/DataAnalysis/ERPDataAnalysis';

export default class ERPBaseComponent extends React.Component {
//RN生命周期
    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // render Loading and tips
    renderSpin() {
        return (
            <SpinView ref="SpinView"/>
        )
    }

    renderTip() {
        return (
            <TipView ref="TipView"/>
        )
    }

    // show spin and tip
    showSpin() {
        if(this.refs&&this.refs.SpinView){
            this.refs.SpinView.show()
        }
    }

    dismissSpin() {
        if(this.refs&&this.refs.SpinView){
            this.refs.SpinView.dismiss()
        }
    }

    showTip(text) {
        this.refs.TipView.show(text)
    }

    // checkData
    cheakData(data) {
        let isSucess = Analysis.check(data);
		console.log("base test");
        if (isSucess) {
            // do nothing
        }
        else {
            this.showTip(data.msg);
        }

        return isSucess;
    }
}