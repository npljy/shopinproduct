import React, { Component } from 'react';
import { Table, Input, Icon, Pagination, Button, message, Spin } from 'antd';
import { connect } from 'react-redux';
import wildcard from '../../../store/wildcard';
import ERPFetch from '../../../utils//Fetch/ERPFetch';
import ERPBaseComponent from '../../../codeHK_component/ComponentBase/ERPBaseComponent'
import tools from '../../../utils/tools'
import { is } from 'immutable';
import MutilsCookie from '../../../utils/cookie';
import './index.css'
import store from '../../../store';

class ProductList extends ERPBaseComponent {
    constructor(props) {
        super(props);
        //console.log(1212, props)
        this.pullDown = this.pullDown.bind(this);
        this.soldout = this.soldout.bind(this);
        this.educe = this.educe.bind(this);
        this.putNo = this.putNo.bind(this);
        this.editProductName = this.editProductName.bind(this);
        this.rquestData = this.rquestData.bind(this);
        this.push = this.push.bind(this);
        this.state = {

            productName: '',
            isShowEditname: false,
            pullDown: false,
            soldout: false,
            educe: false,
            curItem: 0,
            putSpuArray: [],
            curPage: 1,
            pageSize: 20,
            listLoading: false,
            columns: [{
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                className: "text-center operation",
                width: '5%',
                render: (a, b, c) => {

                    switch ("" + this.props.currentIndex) {
                        case "0":
                            return (
                                <div >
                                    <span className="add" data-act="add" onClick={() => { this.push(b.spuNo) }} >详情</span><br />
                                    <span className="modify" data-act="modify" onClick={() => { this.push(b.spuNo) }} >编辑</span>
                                </div>
                            )
                            break;
                        case "1":
                            return (
                                <div >
                                    <span className="add" data-act="add" onClick={() => { this.push(b.spuNo) }} >详情</span><br />
                                    <span className="modify" data-act="modify" onClick={() => { this.push(b.spuNo) }} >编辑</span><br />
                                    <a href="javascript:" onClick={() => { this.pullDown('3', [b.spuNo]) }}>上架</a>
                                </div>
                            )
                            break;
                        case "2":
                            return (
                                <div >
                                    <span className="add" data-act="add" onClick={() => { this.push(b.spuNo) }} >详情</span><br />
                                    <span className="modify" data-act="modify" onClick={() => { this.push(b.spuNo) }} >编辑</span><br />
                                    <a href="javascript:" onClick={() => { this.pullDown('4', [b.spuNo]) }}>下架</a>
                                </div>
                            )
                            break;
                        case "3":
                            return (
                                <div >
                                    <span className="add" data-act="add" onClick={() => { this.push(b.spuNo) }} >详情</span><br />
                                    <span className="modify" data-act="modify" onClick={() => { this.push(b.spuNo) }} >编辑</span><br />
                                    <a href="javascript:" onClick={() => { this.pullDown('3', [b.spuNo]) }}>上架</a>
                                </div>
                            )
                            break;
                        default: break;
                    }
                }
            }, {
                title: '商品信息',
                dataIndex: 'productInfo',
                key: 'productInfo',
                width: '28%',
                className: "text-center product-info",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    return (
                        <div >
                            <img src={b.picUrl} alt="" style={{ width: '33%' }} />
                            <div className="np-pinfo">
                                <p style={{ fontWeight: 'bold', display: this.state.isShowEditname && c === this.state.curItem ? 'none' : 'block' }} >{b.productName}<Icon type="edit" onClick={() => this.editProductName(b.productName, c)} /></p>
                                <p style={{ display: this.state.isShowEditname && c === this.state.curItem ? 'block' : 'none' }} ><Input size="small" value={this.state.productName} onKeyDown={(e)=>{this.nameOnKeyDown(e,b)}} onChange={this.changeProductName} /><Icon onClick={() => this.editOK(b)} type="check" /><Icon onClick={this.editCancel} type="close" /></p>
                                <p>SPU：{b.spuNo}</p>
                                <p>品牌：{b.brandEnName}</p>
                                <p>颜色：{b.color}</p>
                                <p>商城分类：{b.shopCategory}</p>
                            </div>
                        </div>
                    )
                }
            }, {
                title: '辅助信息',
                dataIndex: 'otherInfo',
                key: 'otherInfo',
                width: '27%',
                className: " other-info",
                render: (a, b, c) => {
                    return (
                        <div>
                            <p>尚品名称：{b.spProductName ? b.spProductName : b.productName}</p>
                            <p>尺寸：{b.size}</p>
                            <p>货号：{b.artNo}</p>
                            <p>后台分类：{b.erpCategory}</p>
                        </div>
                    )
                }
            }, {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                width: '10%',
                className: "",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    return (
                        <div >
                            <p>售价：</p>
                            <p>{b.showPrice}</p>
                            <p>毛利：{b.grossProfit}%</p>
                        </div>
                    )
                }
            }, {
                title: '库存',
                dataIndex: 'total',
                key: 'total',
                width: '5%',
                className: "text-center",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    return <div >
                        <p>{b.inventoryQuantity || 0}</p>
                    </div>
                }
            }, {
                title: '总销量',
                dataIndex: 'salesVolume',
                key: 'salesVolume',
                width: '5%',
                className: "text-center",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    return (
                        <div >
                            <p>{b.saleQuantity || 0}</p>
                        </div>
                    )
                }
            }, {
                title: '分享次数',
                dataIndex: 'share',
                key: 'share',
                width: '5%',
                className: "text-center",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    return (
                        <div >
                            <p>{b.shareQuantity || 0}</p>
                        </div>
                    )
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: '5%',
                className: "text-center",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    return (
                        <div>
                            {parseInt(b.modelPicStatus, 10) === 1 ? (<p>主图<Icon type="check-circle" style={{ color: 'green' }} /></p>) : (<p>主图<Icon type="close-circle" style={{ color: 'red' }} /></p>)}
                            {parseInt(b.status, 10) === 1 ? (<p>定价<Icon type="check-circle" style={{ color: 'green' }} /></p>) : (<p>定价<Icon type="close-circle" style={{ color: 'red' }} /></p>)}
                        </div>
                    )
                }
            }, {
                title: '时间',
                dataIndex: 'time',
                key: 'time',
                width: '15%',
                className: "text-center text-time",
                render: (a, b, c) => {
                    // //console.log(a,b,c);
                    switch ("" + this.props.currentIndex) {

                        case "2":
                            return (
                                <div>
                                    <p>上架：<br />{b.shelfTime.split(" ")[0]}<br />{b.shelfTime.split(" ")[1]}</p><br />
                                    <p>修改：<br />{b.updateTime.split(" ")[0]}<br />{b.updateTime.split(" ")[1]}</p>
                                </div>
                            )
                            break;
                        case "3":
                            return (
                                <div >
                                    <p>下架：<br />{b.shelfTime.split(" ")[0]}<br />{b.shelfTime.split(" ")[1]}</p><br />
                                    <p>修改：<br />{b.updateTime.split(" ")[0]}<br />{b.updateTime.split(" ")[1]}</p>
                                </div>
                            )
                            break;
                        default:
                            return (
                                <div >
                                    <p>修改：<br />{b.updateTime.split(" ")[0]}<br />{b.updateTime.split(" ")[1]}</p>
                                </div>
                            )
                            break;
                    }

                }
            }
            ],

        }
    }


    componentWillMount() {
        const { currentIndex, memory, pageSize, pageIndex } = this.props;
        if (currentIndex == memory) {
            this.rquestData(pageIndex, pageSize);
            console.log('haha OK了', currentIndex, memory);
        }
    }
  
    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate")
        const thisProps = this.props || {};
        const thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length || Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
        for (const key in nextProps) {
            if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])){
                return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])){
                return true;
            }
        }
        return false;
    }

    push = (num) => {
        this.props.handleLeaveIndex(this.props.currentIndex);
        this.props.router.push("/app/productedit/" + num)
    }
    changeProductName = (e) => {
        //console.log(3333, e.target.value)
        this.setState({
            productName: e.target.value
        })
    }

    editProductName = (name, c) => {
        this.setState({
            isShowEditname: true,
            productName: name,
            curItem: c
        })
    }
    nameOnKeyDown= (e,curData)=>{
        // console.log(e.keyCode)
        if(e.keyCode === 13){
            this.editOK(curData)
        }else if(e.keyCode ===27){
            this.editCancel()
        }
    }
    editCancel = () => {
        this.setState({
            isShowEditname: false,
            productName: '',
        })
    }

    editOK = (curData) => {
        let _this = this;
        let { productName } = this.state;
        console.log("productName", productName)
        let obj = {
            url: '/api/product/productNameEdit',
            type: 'post',
            params: {
                "productName": productName,
                "productNo": curData.spuNo
            },
            success: function () {
                _this.setState({
                    isShowEditname: false,
                })
                _this.rquestData(_this.props.pageIndex, _this.props.pageSize)
            },
            fail: function () { }
        }
        tools.fetchData(obj);
    }

    onPageChange = (current, pageSize) => {
        this.rquestData(current, pageSize)
        let {allData,currentIndex} = this.props;
        allData[currentIndex].pageIndex = current;
        allData[currentIndex].pageSize = pageSize;
        this.props.filterDataChange(allData);
        this.editCancel();
    }
    toPage = (e) => {
        let toNum = e.target.parentNode.parentNode.querySelector("input").value;
        if (!toNum) return;
        this.onPageChange(parseInt(toNum, 10), this.props.pageSize)
    }
    rquestData = (pageindex, pagesize) => {
        console.log("request start")
        this.setState({
            listLoading:true
        })
        let {
            allData,
            currentIndex,
            filterData,
            listDataChange
        } = this.props;
        ERPFetch.fetch(
            {},
            '/api/product/productList',
            {
                "pageNum": pageindex,
                "pageSize": pagesize,
                "shelfStatus": currentIndex * 1 + 1,
                ...filterData
            }
        )
            .then((res) => {
                if (super.cheakData(res)) {//数据请求成功
                    allData[currentIndex].content = res.content;
                    //console.log(allData, 'all', currentIndex)
                    listDataChange(allData)
                    console.log("request over")
                    console.log(this.state.listLoading)
                    this.setState({
                        listLoading:false
                    })
                }
            })
    }
    putNo(productList = []) {
        this.setState((state) => {
            state.putSpuArray = productList.map((item) => item.spuNo)
            return state;
        }, () => {
            console.log(this.state.putSpuArray, '待上架的尚品编号')
        })
    }
    pullDown(status, putSpu) {//商品上架>>>多个/单个
        const _this = this;
        let { putSpuArray } = _this.state;
        let { pageIndex, pageSize } = _this.props;
        let singleAndDouble = putSpu ? putSpu.length > 0 ? true : false : false
        let tip = status == '3' ? '上架' : '下架';
        _this.setState({ pullDown: true });
        if (putSpuArray.length < 1 && !singleAndDouble) {
            message.error('请选择要' + tip + '的商品！！！');
            setTimeout(() => {
                _this.setState({ pullDown: false });
            }, 500)
            return;
        }
        console.log(putSpu, '单个下架');
        // console.log(putSpuArray.indexOf(putSpu[0]),'下标');
        // console.log(putSpuArray.splice(putSpuArray.indexOf(putSpu[0]),1));
        ERPFetch.fetch(
            {},
            '/api/product/shelf',
            {
                productNos: singleAndDouble ? putSpu : putSpuArray,
                status: status
            }
        ).then((res) => {
            if (super.cheakData(res)) {
                singleAndDouble
                    ? _this.setState((state) => {
                        let index = putSpuArray.indexOf(putSpu[0]);
                        state.pullDown = (index != -1
                            ? putSpuArray.splice(index, 1)
                            : putSpuArray)
                        return state;
                    })
                    : _this.setState({ putSpuArray: [] });
                message.success('√商品' + tip + '成功');
                _this.setState({ pullDown: false });
                // setTimeout(()=>{
                _this.rquestData(pageIndex, pageSize);
                // },4000)
            }
        })
    }
    soldout() {//商品下架
        const _this = this;
        _this.setState({ soldout: true });
        setTimeout(() => {
            _this.setState({ soldout: false });
        }, 2000)

        // ERPFetch.fetch(
        //     {},
        //     'app/product/shelf',
        //     {
        //         "operator": 'user',
        //         "productNos": [],
        //         "status": '4'
        //     }
        // ).then((res)=>{
        //     //console.log(res,'商品下架信息')
        // })
    }
    educe() {//商品导出
        const _this = this;
        let { filterData, currentIndex } = _this.props;
        _this.setState({ educe: true });
        ERPFetch.fetchExcel(
            {},
            '/api/product/syn-export',
            {
                "operator": 'user',
                'shelfStatus': currentIndex * 1 + 1,
                ...filterData
            }
        ).then((res) => {
            if (res == 'ok') {
                _this.setState({ educe: false });
            }
        })

    }
    render() {
        // console.log("productList render")
        let { currentIndex, pageIndex, pageSize, } = this.props;
        let { columns, pullDown, educe, putSpuArray } = this.state;
        const rowSelection = {
            selectedRowKeys: putSpuArray,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.putNo(selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <div className="product-list" >
                <Spin style={{ textAlign: 'center', height: '20px', display: this.state.listLoading ? 'block' : 'none' }} />
                <div>
                    <div className='product-list-btn-box'>
                        {parseInt(currentIndex, 10) === 1 || parseInt(currentIndex, 10) === 3 ? <Button loading={pullDown} onClick={() => { this.pullDown('3') }} >上架</Button> : ''}
                        {parseInt(currentIndex, 10) === 2 ? <Button loading={pullDown} onClick={() => { this.pullDown('4') }} >下架</Button> : ''}
                        <Button loading={educe} onClick={this.educe} >导出</Button>
                    </div>
                    <Pagination
                        id="page"
                        showTotal={total => `共${total}条`}
                        showQuickJumper
                        showSizeChanger
                        // hideOnSinglePage
                        defaultCurrent={1}
                        defaultPageSize={20}
                        pageSize={this.props.pageSize}
                        current={this.props.pageIndex}
                        pageSizeOptions={["20", "50", "100"]}
                        total={this.props.listData.total || 0}
                        onShowSizeChange={this.onPageChange}
                        onChange={this.onPageChange}
                        style={{ display: tools.voidObj(this.props.listData) ? 'none' : 'inline-block' }}
                    />
                    <div style={{ display: tools.voidObj(this.props.listData) ? 'none' : 'inline-block' }} className="to-page-btn"><Button onClick={this.toPage} >确定</Button></div>
                </div>
                <div className="list-table">
                    <Table
                        bordered
                        pagination={false}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.props.listData.list || []}
                        rowKey={(a, b) => {
                            return a.spuNo;
                        }}
                    />
                </div>
                <div>
                    <Pagination
                        id="page"
                        showTotal={total => `共${total}条`}
                        showQuickJumper
                        showSizeChanger
                        // hideOnSinglePage
                        defaultCurrent={1}
                        defaultPageSize={20}
                        pageSize={this.props.pageSize}
                        current={this.props.pageIndex}
                        pageSizeOptions={["20", "50", "100"]}
                        total={this.props.listData.total || 0}
                        onShowSizeChange={this.onPageChange}
                        onChange={this.onPageChange}
                        style={{ display: tools.voidObj(this.props.listData) ? 'none' : 'inline-block' }}
                    />
                    <div style={{ display: tools.voidObj(this.props.listData) ? 'none' : 'inline-block' }} className="to-page-btn"><Button onClick={this.toPage} >确定</Button></div>
                </div>
            </div>
        );
    }

}

// educeort default ProductList;

//   //拿到state里的  当前选项卡中的 列表数据 
const mapStateToProps = (state, props) => {
    let index = state.Processing.currentIndex;
    //console.log("list", state)
    return {
        listData: state.Processing.allData[index].content,
        currentIndex: state.Processing.currentIndex,
        pageSize: state.Processing.allData[index].pageSize,
        pageIndex: state.Processing.allData[index].pageIndex,
        filterData: state.Processing.allData[index].filterData,
        allData: state.Processing.allData,
        memory: state.Processing.memory
    }
}


function mapDispatchToProps(dispatch) {
    return {
        filterDataChange(allData) {
            dispatch({
                type: wildcard.ALL_THE_DATA,
                data: allData
            })
        },
        listDataChange(allData) {
            dispatch({
                type: wildcard.ALL_THE_DATA,
                data: allData
            })
        },
        handleLeaveIndex(leaveIndex) {
            dispatch({
                type: wildcard.LEAVE_INDEX,
                data: leaveIndex
            })
        },
        changeCurrentPage(data){
            console.log("change page")
            dispatch({
                type:'CURRENT_PAGE',
                data:data
            })
        }
    }
}
const reduxList = connect(mapStateToProps, mapDispatchToProps)(ProductList);

export default reduxList;


