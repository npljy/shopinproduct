import React, { Component } from 'react';
import { Menu, Tabs } from 'antd';
import { Link } from 'react-router';
import Processing from './processing';
import './commodityManagement.css';
import store from '../../store';
import ERPFetch from '../../utils/Fetch/ERPFetch';
import wildcard from '../../store/wildcard';
import { connect } from 'react-redux';
import FormControls from './form';
import ProductList from './productlist';

const TabPane = Tabs.TabPane;

class CommodityManagement extends Component {
    constructor(props) {
        super(props)
        console.log(props);
        this.callback = this.callback.bind(this);
        // this._requestListData = this._requestListData.bind(this);
    }
    componentWillMount() {
        // this._requestListData({});
        // console.log(this.props, 'this.props')
    }
    callback(key) {
        console.log(key)
        this.props.currentIndexChange(key);
        this.props.handleLeaveIndex(null);
    }
    // _requestListData (filterData, state) {
    //     const _this = this;
    //     let {currentIndex, allData, allTheDataChange} = state.Processing;
    //     console.log(currentIndex, allData, allTheDataChange);
    //     ERPFetch.fetch(
    //         {},
    //         '/api/product/productList',
    //         {
    //             "pageNum": 1,
    //             "pageSize": 10,
    //             ...filterData
    //         }
    //     )
    //     .then((res)=>{
    //         if (res.code == 0) {//数据请求成功
    //             allData[currentIndex].content = res.content;
    //             console.log(allData, 'all', currentIndex)
    //             allTheDataChange(allData);
    //         }
    //     })
    // }
    render() {
        return <div className='commodityManagement'>
            <Tabs animated={false} activeKey={this.props.currentIndex+''} onChange={this.callback}>
                <TabPane className='tabs-content' tab="待加工" key="0">
                    <FormControls curPage="0" />
                    <ProductList router={this.props.router} />
                </TabPane>
                <TabPane className='tabs-content' tab="可上架" key="1">
                    <FormControls curPage="1" />
                    <ProductList router={this.props.router} />
                </TabPane>
                <TabPane className='tabs-content' tab="已上架" key="2">
                    <FormControls curPage="2" />
                    <ProductList router={this.props.router} />
                </TabPane>
                <TabPane className='tabs-content' tab="已下架" key="3">
                    <FormControls curPage="3" />
                    <ProductList router={this.props.router} />

                </TabPane>
            </Tabs>
        </div>
    }
}

function mapStateToProps(state) {

    return {
        currentIndex: state.Processing.currentIndex,
        allData: state.Processing.allData,
        memory: state.Processing.memory
    }
}

function mapDispatchToProps(dispatch, state) {
    return {
        allTheDataChange(allData) {
            dispatch({
                type: wildcard.ALL_THE_DATA,
                data: allData
            })
        },
        currentIndexChange(index) {
            dispatch({
                type: wildcard.CURRENT_INDEX,
                data: index
            })
        },
        handleLeaveIndex ( leaveIndex ) {
            dispatch({
                type: wildcard.LEAVE_INDEX,
                data: leaveIndex
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommodityManagement);