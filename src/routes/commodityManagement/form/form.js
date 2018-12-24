import React,{Component} from 'react';
import { Form, Input, Row, Col, Select, DatePicker, Button} from 'antd';
import wildcard from '../../../store/wildcard';//对照表
import Cascade from '../cascade';
import ERPFetch from '../../../utils//Fetch/ERPFetch';
import ERPBaseComponent from '../../../codeHK_component/ComponentBase/ERPBaseComponent';
import { connect } from 'react-redux';
import {headers} from "../../../utils/Fetch/headers"
import './form.css';

const FormItem = Form.Item;
const Option = Select.Option; 
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const selectList = [
    {
        label: 'A01',
        text: '女士',
        children: [
            {
                label: 'A01B01',
                text: '春季',
                children: [
                    {
                        label: 'A01B01C01',
                        text: '上衣'
                    }
                ]
            }
        ]
    },
    {
        label: 'A02',
        text: '男士',
        children: [
            {
                label: 'A02B01',
                text: '春季',
                children: [
                    {
                        label: 'A02B01C01',
                        text: '上衣'
                    }
                ]
            }
        ]
    }
]

class FormControls extends ERPBaseComponent {
    constructor ( props ) {
        super( props )
        this._show = this._show.bind(this);
        this._blur = this._blur.bind(this);
        this._focus = this._focus.bind(this);
        this._searchList = this._searchList.bind(this);
        this._requestDropData = this._requestDropData.bind(this);
        this._resetVlues = this._resetVlues.bind(this);
        this._getPinPai = this._getPinPai.bind(this);
        this._getSupplier = this._getSupplier.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSupplierSearch = this.handleSupplierSearch.bind(this)

        this.state = {
            inputTextArea: false,//spu
            searchBtnLoading: false,//查询
            controlTheDisplayBool: false,//展开收起
            controlTheDisplayText: '展开',//展开收起
            pinpailist: [],//全部品牌下拉数据
            selectData: [],//筛选之后的下拉数据
            selectData: [],//筛选之后的品牌下拉数据
            selectdSupplier: [],//筛选之后的供应商下拉数据
            pinpaivalue: '',//品牌value
            DropData: [
                {data: [], value: ''},
                {data: [], value: ''},
                {data: [], value: ''}
            ]
        }
    } 
    componentWillMount(){
        this._requestDropData(0, 'root')
        this._getPinPai();
        this._getSupplier();
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     console.log(nextProps, nextState, 'shouldComponentUpdate')
    // }
    _getPinPai () {
        const _this = this;
        ERPFetch.fetch(
            {},
            '/api/product/getAllBrand',
            {}
        )
        .then((res)=>{
            if(super.cheakData(res)){
                // _this.setState({pinpailist: res.content});
                _this.setState((state)=>{
                    state.pinpailist = res.content;
                    // state.selectData = res.content.slice(0,100);
                    return state;
                }, ()=>{
                    console.log(this.state.selectData, 'filter')
                })
                // console.log(res.content)
            }
        })
    }
    _getSupplier(){
        const _this = this;
        fetch('http://192.168.20.184:8010/dictionary/getAllSupplier?isReset=true',{
            method: 'POST',
            mode: "cors",
            headers: headers,
        }).then((res)=>{
            return res.json();
        }).then((res)=>{
            if(super.cheakData(res)){
                // _this.setState({pinpailist: res.content});
                _this.setState((state)=>{
                    state.supplierList = res.content;
                    // state.selectData = res.content.slice(0,100);
                    return state;
                })
            }
        })
    }
    handleSearch (value) {
        const _this = this;
        const {pinpailist, pinpaivalue} = _this.state;
        const length1 = pinpaivalue.split('').length;
        const length2 = value.split('').length;
        if( length1 == 0 && length2 == 1){
            const newList = pinpailist.filter((item)=>{
                return item.brandEnName.toLowerCase().indexOf(value.toLowerCase()) >= 0
            })
            this.setState({selectData: newList})
        }else {
            this.setState({pinpaivalue: value})
        }
    }
    handleSupplierSearch (value) {
        const _this = this;
        const {supplierList, suppliervalue} = _this.state;
        const length2 = value.split('').length;
        if ( value != '' ) {
            const newList = supplierList.filter((item)=>{
                return item.supplierName.toLowerCase().indexOf(value.toLowerCase()) >= 0
            })
            this.setState({selectdSupplier: newList})
        }
    }
    _searchList () {
        const _this = this;
        const { getFieldsValue, getFieldValue, validateFields } = _this.props.form;
        let { currentIndex, allData, filterDataChange, listDataChange} = _this.props;
        validateFields((err, values)=>{
            if(err) return;
            console.log(values);
            let tostring = Object.prototype.toString;
            let array = Object.keys(values);
            let searchData = {};
            array.map((item, index)=>{
                let ig = values[item];
                if ( tostring.call(ig) === '[object Object]' ) {//下拉数据
                    if(ig.key && ig.key !== '一级分类' && ig.key !== '二级分类' && ig.key !== '三级分类'){
                        searchData[item] = ig.key;
                    }
                } else if ( tostring.call(ig) === '[object Array]' ) {//时间数据
                    // format('YYYY-MM-DD');
                    searchData['updateTimeStart'] = ig[0].format('YYYY-MM-DD HH:mm:ss')
                    searchData['updateTimeEnd'] = ig[1].format('YYYY-MM-DD HH:mm:ss')
                }  else if ( tostring.call(ig) === '[object String]' ) {//普通数据
                    if(item == 'status' && ig == '5'){return}
                    ig = ig.replace(/\s+/g,"");
                    if ( ig ) {
                        searchData[item] = ig;
                    }
                    
                }
            })

            if(searchData.productNos){
                console.log(searchData.productNos);
                var productNosList = searchData.productNos.split(",");
                searchData.productNos = productNosList.filter((item, index)=>{
                    return item !== '';
                })
            }
            allData[currentIndex].filterData = searchData;
            filterDataChange(allData);
            // pageIndex:1,
            // pageSize:20
            ERPFetch.fetch(
                {},
                '/api/product/productList',
                {
                    "pageNum":  1,
                    "pageSize": allData[currentIndex].pageSize,
                    shelfStatus: currentIndex * 1 + 1,
                    ...searchData
                }
            )
            .then((res)=>{
                if ( super.cheakData(res) ) {//数据请求成功
                    allData[currentIndex].pageIndex = 1;
                    allData[currentIndex].content = res.content;
                    listDataChange(allData)
                }
            })

        })
        
        if(_this.state.searchBtnLoading == false){
            _this.setState((state)=>{
                state.searchBtnLoading = true
            },()=>{
                setTimeout(()=>{
                    _this.setState({searchBtnLoading: false})
                },3000)
            })
        }
    }
    _resetVlues(){
        const _this = this;
        const {resetFields} = _this.props.form;
        resetFields();
    }
    _show () {
        const _this = this;
        const {controlTheDisplayBool, controlTheDisplayText} = _this.state;
        if ( controlTheDisplayBool ) {
            _this.setState({controlTheDisplayBool: false, controlTheDisplayText: '展开'})
        } else {
            _this.setState({controlTheDisplayBool: true, controlTheDisplayText: '收起'})
        }
    }
    _focus () {
        const _this = this;
        console.log('获取焦点');
        _this.setState({inputTextArea: true});
    }
    _blur () {
        const _this = this;
        _this.setState({inputTextArea: false});
    }
    _requestDropData (index, value) {
        let _this = this;
        let { resetFields } = _this.props.form;
        ERPFetch.fetchGet({}, '/api/shopCategory/shopCategoryListByCategoryNo/'+value)
        .then((res)=>{
            // alert(JSON.stringify(res));
            if ( super.cheakData(res) ) {
                //  console.log(index, 'index')
                var DropData = _this.state.DropData;
                if ( index == 0 && value == 'root' ) {
                    DropData[index].data = res.content;
                    _this.setState((state)=>{
                        state.DropData = DropData;
                    },()=>{
                        // console.log(_this.state)
                    })
                    // console.log('初始化第一个下拉数据');
                }else if (index == 0 && value) {
                    DropData[index+1].data = res.content;
                    DropData[index+2].data = [];
                    resetFields(['secondCategoryNo', 'thirdCategoryNo'])
                    _this.setState((state)=>{
                        state.DropData = DropData;
                    },()=>{
                        // console.log(_this.state)
                    })
                    // console.log('初始化第二个下拉数据 并给value赋值');
                }else if (index == 1 && value) {
                    DropData[index+1].data = res.content;
                    resetFields(['thirdCategoryNo'])
                    _this.setState((state)=>{
                        state.DropData = DropData;
                    },()=>{
                        // console.log(_this.state)
                    })
                    // console.log('初始化第三个下拉数据 并给value赋值');
                }else if (index == 2 && value) {
                    _this.setState((state)=>{
                        state.DropData = DropData;
                    },()=>{
                        // console.log(_this.state)
                    })
                }
            }
            
        })
    }
    handleSubmit (form) {
        console.dir(form);
        alert(form)
        
        
        return false
    }
    render () {
        const _this = this;
        const { DropData, selectData } = _this.state;
        const { getFieldDecorator } = this.props.form;
        const labelCol = {xl: 2, lg: 3, md: 4, sm: 5, xs: 6};
        const wrapperCol = {xl: 22, lg: 21, md: 20, sm: 19, xs: 18};
        const formItemLayout = {
            labelCol : {xl: 4, lg: 6, md: 8, sm: 10, xs: 12},
            wrapperCol : {xl: 20, lg: 18, md: 16, sm: 14, xs: 12}
        }
        const {searchBtnLoading, controlTheDisplayBool, controlTheDisplayText, inputTextArea, selectdSupplier} = _this.state;
        return (<Form className='form-control' onSubmit={ ()=>{this.handleSubmit(this)} } >
                    <Row className='form-top'>
                        <Col span={6}>  
                            <FormItem
                            label="商品名称"
                            {...formItemLayout}
                            >
                                {getFieldDecorator('productName', {
                                    rules: [{}]
                                })(
                                <Input name='mohu' placeholder='模糊查询'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>  
                            <FormItem
                            label="货号"
                            {...formItemLayout}
                            >
                                {getFieldDecorator('artNo', {
                                    rules: [{}]
                                })(
                                <Input placeholder='货号'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>  
                            <FormItem
                            className='col-fotm-item-input-root'
                            label="SPU"
                            {...formItemLayout}
                            >
                                {getFieldDecorator('productNos', {
                                    rules: [{}]
                                })(
                                <TextArea className={'input-position ' + (inputTextArea ? 'input-textArea' : '') } onFocus={ _this._focus } onBlur={ _this._blur } placeholder='SPU,批量请以英文逗号隔开！'/>
                                )}
                            </FormItem>
                        </Col> 
                        <Col span={6}>
                            <FormItem
                            label="品牌"
                            {...formItemLayout}
                            >
                                {getFieldDecorator('brandEnName', {
                                    rules: [{}]
                                })(
                                    <Select
                                    showSearch
                                    placeholder="品牌"
                                    optionFilterProp="children"
                                    notFoundContent={'请输入品牌名称'}
                                    filterOption={(input, option) => {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    }
                                    onSearch={this.handleSearch}
                                    >
                                    {selectData.map((item, index)=>{
                                        return <Option key={item.brandCnName+item.brandEnName} value={item.brandEnName}>{item.brandEnName}</Option>
                                    })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row >
                    <Row id={ controlTheDisplayBool ? '' : 'hide' } className='form-top'>
                        <Col span={12}>
                            <Cascade
                            label="商城分类"
                            selectList={DropData}
                            _getFieldDecorator={getFieldDecorator}
                            _requestDropData={this._requestDropData}
                            childId={['firstCategoryNo', 'secondCategoryNo', 'thirdCategoryNo']} />
                        </Col>
                        <Col span={6}>
                            <FormItem
                            label="供应商"
                            {...formItemLayout}
                            >
                                {getFieldDecorator('supplierNo', {
                                    rules: [{}]
                                })(
                                    <Select
                                    showSearch
                                    placeholder="供应商"
                                    optionFilterProp="children"
                                    notFoundContent={'请输入供应商名称'}
                                    filterOption={(input, option) => {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    }
                                    onSearch={this.handleSupplierSearch}
                                    >
                                    {selectdSupplier.map((item, index)=>{
                                        return <Option key={item.supplierNo}>{item.supplierName}</Option>
                                    })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>  
                            <FormItem
                            label="状态"
                            {...formItemLayout}
                            >
                                {getFieldDecorator('status', {
                                    rules: [{}],
                                    initialValue: '5'
                                })(
                                    <Select>
                                        <Option key='5'>全部</Option>
                                        <Option key='1'>定价已完成</Option>
                                        <Option key='0'>定价未完成</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row id={ controlTheDisplayBool ? '' : 'hide' } className='form-top'>
                        <Col span={12}>
                            <FormItem
                            label="更新时间"
                            labelCol={labelCol}
                            wrapperCol={{span: 16}}
                            >
                                {getFieldDecorator('updateTime', {
                                    rules: [{type: 'array'}]
                                })(
                                <RangePicker placeholder={['开始时间', '结束时间']} format='YYYY-MM-DD HH:mm:ss' showTime></RangePicker>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className='form-top'>
                        <Col className='col-center' offset={9} span={2}>
                            <Button disabled={searchBtnLoading} loading={searchBtnLoading} onClick={_this._searchList}>查询</Button>
                        </Col>
                        <Col className='col-center' span={2}> 
                            <Button onClick={this._resetVlues}>重置</Button>
                        </Col>
                        <Col className='col-center' span={2}>
                            <span className='col-center-sp' onClick={_this._show}>{controlTheDisplayText}</span>
                        </Col>
                    </Row>
                </Form>)
    }
}
const a1 = Form.create()(FormControls);

function mapStateToProps (state) {
    return {
        currentIndex: state.Processing.currentIndex,
        allData: state.Processing.allData
    }
}
function mapDispatchToProps (dispatch) {
    return {
        filterDataChange (allData) {
            dispatch({
                type: wildcard.ALL_THE_DATA,
                data: allData
            })
        },
        listDataChange (allData) {
            dispatch({
                type: wildcard.ALL_THE_DATA,
                data: allData
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(a1);