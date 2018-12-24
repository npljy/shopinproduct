import React from 'react';
import './index.css';
import { Form, Table, Input, Select, Button, message, notification } from 'antd';
import { is } from 'immutable';
import KindEditorReactComponent from './editor/MyReactComponent';
import Dropzone from 'react-dropzone';
import tools from '../../../utils/tools'
import MutilsCookie from '../../../utils/cookie';
import ERPBaseComponent from '../../../codeHK_component/ComponentBase/ERPBaseComponent'
import testData from './testdata'

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;

class ProductEdit extends ERPBaseComponent {
    constructor(props) {
        super();
        this.onImageDrop = this.onImageDrop.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.outPicLi = this.outPicLi.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onOut = this.onOut.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.editorChange = this.editorChange.bind(this);
        this.cancel = this.cancel.bind(this);

        this.state = {
            detailData: testData,
            spuPictureList: [],
            uploadedFile: [],
            moveIndex: -1,
            oneOpts: [],
            twoOpts: [],
            threeOpts: [],
            describe: '',
            priceColumns: [
                {
                    title: 'SKU',
                    dataIndex: 'SKU',
                    key: 'SKU',
                    render: (a, b, c) => {
                        let lis = b.secondSkuInfo.map((e, i) => <li key={"" + e.skuNo + i} style={{ height: e.threeSkuInfo.length * 28 + "px", lineHeight: e.threeSkuInfo.length * 28 + "px", textAlign: "center", borderBottom: "1px solid #d9d9d9" }} title={e.skuNo}>{e.skuNo}</li>)
                        // console.log(lis)
                        return <ul>{lis}</ul>
                    }
                },
                {
                    title: '图片',
                    dataIndex: 'PIC',
                    key: 'PIC',
                    className: 'td-pic',
                    render: (a, b, c) => {
                        // console.log(b)
                        return <img width="60" src={b.productPicList} alt="" />
                    }
                },
                {
                    title: '颜色',
                    dataIndex: 'COLOR',
                    key: 'COLOR',
                    render: (a, b, c) => {
                        return <div style={{ textAlign: "center" }}>{b.color}</div>
                    }
                },
                {
                    title: '尺码',
                    dataIndex: 'SIZE',
                    key: 'SIZE',
                    render: (a, b, c) => {
                        let lis = b.secondSkuInfo.map((e, i) => <li key={"" + e.sizeValue + i} style={{ height: e.threeSkuInfo.length * 28 + "px", lineHeight: e.threeSkuInfo.length * 28 + "px", textAlign: "center", borderBottom: "1px solid #d9d9d9" }} title={e.sizeValue}>{e.sizeValue}</li>)
                        // console.log(lis)
                        return <ul>{lis}</ul>
                    }
                },
                {
                    title: '供应商',
                    dataIndex: 'GYS',
                    key: 'GYS',
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ia + eb.supplierName + ib} style={{ borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.supplierName}>{eb.supplierName}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '库存',
                    dataIndex: 'KC',
                    key: 'KC',
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ia + eb.inventory + ib} style={{ textAlign: "right", borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.inventory}>{eb.inventory}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '供价',
                    dataIndex: 'GJ',
                    key: 'GJ'
                    ,
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ia + eb.supplyPrice + ib} style={{ textAlign: "right", borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.supplyPrice}>{eb.supplyPrice}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '售价',
                    dataIndex: 'SJ',
                    key: 'SJ',
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ea + ia + eb + ib} style={{ textAlign: "right", borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.salePrice} >{eb.salePrice}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '毛利率',
                    dataIndex: 'MLL',
                    key: 'MLL',
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ia + eb.grossRate + ib} style={{ textAlign: "right", borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.grossRate*100+"%"}>{eb.grossRate ? (eb.grossRate*100 + "%") : ''}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '运费',
                    dataIndex: 'YF',
                    key: 'YF',
                    className: 'text-center',
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ia + eb.freight + ib} style={{ textAlign: "right", borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.freight}>{eb.freight}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '定价方式',
                    dataIndex: 'DJ',
                    key: 'DJ',
                    className: 'text-center',
                    render: (a, b, c) => {
                        let tmpArr = [];
                        b.secondSkuInfo.forEach((ea, ia) => {
                            ea.threeSkuInfo.forEach((eb, ib) => {
                                tmpArr.push(<li key={"" + ia + eb.pricingMethod + ib} style={{ borderBottom: "1px solid #d9d9d9", height: "28px", lineHeight: "28px" }} title={eb.pricingMethod}>{eb.pricingMethod}</li>)
                            })
                        })
                        return <ul>{tmpArr}</ul>
                    }
                },
                {
                    title: '材质',
                    dataIndex: 'CZ',
                    key: 'CZ',
                    render: (a, b, c) => {
                        let lis = b.secondSkuInfo.map((e, i) => <li key={"" + e.materials + i} style={{ height: e.threeSkuInfo.length * 28 + "px", lineHeight: e.threeSkuInfo.length * 28 + "px", textAlign: "center", borderBottom: "1px solid #d9d9d9" }} title={e.materials} >{e.materials}</li>)
                        // console.log(lis)
                        return <ul>{lis}</ul>
                    }
                },
                {
                    title: '产地',
                    dataIndex: 'CD',
                    key: 'CD',
                    render: (a, b, c) => {
                        let lis = b.secondSkuInfo.map((e, i) => <li key={"" + e.placeOrgins + i} style={{ height: e.threeSkuInfo.length * 28 + "px", lineHeight: e.threeSkuInfo.length * 28 + "px", textAlign: "center", borderBottom: "1px solid #d9d9d9" }} title={e.placeOrgins}>{e.placeOrgins}</li>)
                        // console.log(lis)
                        return <ul>{lis}</ul>
                    }
                }
            ],
        }
    }
    componentDidMount() {
        let _this = this;
        window.KindEditor.ready(function (K) {
            window.editor = K.create('#editor_id');
        });

        let { props: { router: { params: { id } } } } = this;
        let obj = {
            url: "/api/product/productDetail/" + id,
            type: 'post',
            success: function (data) {
                _this.setState({
                    spuPictureList: data.spuPictureList,
                    describe: data.describe,
                    detailData: data
                })
                let { shopCategoryDetail } = data;
                if (shopCategoryDetail) {
                    _this.getSameCate(shopCategoryDetail.firstNo || '');
                    _this.getSameCate(shopCategoryDetail.secondNo || '');
                    _this.getSameCate(shopCategoryDetail.thirdNo || '');
                }
            },
            fail: function (msg) {
                message.warning("获取信息失败："+msg)
            }
        }
        tools.fetchData(obj);
    }

    cancel () {
        window.history.go(-1);
        // console.log('取消')
        notification.close('beyond')
        notification.close('limit')
        
    }
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {};
        const thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length || Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
        for (const key in nextProps) {
            if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    editorChange(value) {
        const _this = this;
        _this.setState({ describe: value });
    }
    onImageDrop(files) {
        const { uploadedFile, spuPictureList} = this.state;
        let size = '';
        const filterUploadFile = files.filter((item, index)=>{
            const bool = item.size/(1024*1024) <= 3;
            if(!bool){
                size += item.name+'，'
            }
            return bool;
        })
        if(size){
            notification.open({
                key: 'beyond',
                description:'您刚上传的名为--'+size+'--的图片超出上传大小限制，已自动忽略。',
                message: '提示框',
                placement: 'topRight',
                duration: null,
            })
        }
        this.setState((state)=>{
            var ar = [...uploadedFile, ...filterUploadFile]
            var len1 = ar.length;
            var len2 = spuPictureList.length;
            if(len1+len2>20){
                ar = ar.slice(0,20-len2)
                notification.open({
                    key: 'limit',
                    description: '上传限制20，已超出。自动为您保留了前20张。',
                    message: '提示框',
                    placement: 'topRight',
                    duration: null,
                })
            }
            state.uploadedFile = ar;
            return state;
        });

    }
    handleImageUpload() {
        const { getFieldValue, validateFieldsAndScroll } = this.props.form;
        const { uploadedFile, describe, spuPictureList } = this.state;
        let { props: { router: { params: { id } } } } = this;
        let tostring = Object.prototype.toString;
        super.showSpin();
        let fd = new FormData();
        let er = false;
        validateFieldsAndScroll(['productName', 'shopFirstName', 'shopSecondName', 'shopThirdName'], (err, val) => {
            if (err) {
                console.log(err);
                er = true;
                super.dismissSpin();
                for (let attr in err) {
                    message.warning(err[attr].errors[0].message);
                }
            }
            fd.append('shopCategoryNo', val.shopThirdName);
        })
        if (er) return;
        console.log(describe)
        if (tostring.call(describe) === '[object String]' && describe === '') {
            alert('商品描述,不能为空!!!');
            super.dismissSpin();
            return
        }
        if (tools.getByteLen(getFieldValue('productName')) > 100) {
            message.warning("商品名称过长");
            super.dismissSpin();
            return;
        }
        fd.append('productName', getFieldValue('productName'));
        fd.append('productDesction', describe);
        fd.append('urls', spuPictureList);
        fd.append('operator', 'wang');
        fd.append('productNo', id);
        uploadedFile.forEach((item, index) => {
            fd.append('uploadFile' + index, item);
        })
        fetch('/api/product/productEdit', {
            method: 'POST',
            body: fd,
            headers: { token: MutilsCookie.get('userInfo') },
        }).then((response) => {
            return response.json();
        }).then((e) => {
            if(super.cheakData(e)){
                setTimeout(()=>{
                    super.dismissSpin();
                    notification.close('beyond')
                    notification.close('limit')
                    this.props.router.push('/app/CommodityManagement');
                },1500)
                
            }
        })
    }
    onEnter(index) {
        this.setState({ moveIndex: index })
    }
    onDelete(index) {
        this.setState((state) => {
            let cdrs = state.uploadedFile
            cdrs.splice(index, 1);
            state.uploadedFile = [...cdrs];
            return state;
        })
    }
    onDeletes(index) {
        this.setState((state) => {
            let cdrs = state.spuPictureList
            cdrs.splice(index, 1);
            state.spuPictureList = [...cdrs];
            return state;
        })
    }
    onOut() {
        this.setState({ moveIndex: -1 })
    }

    outPicLi = (arr) => {
        if (Object.prototype.toString.call(arr) !== "[object Array]") arr = [];
        let tmpArr = arr.map((e, i) => <li key={"" + e + i}><img src={e} data-index={i} onError={(e) => { e.target.style.marginLeft = '0' }} alt="" /></li>)
        return tmpArr;
    }
    // 拿到初始化 商城分类的 平级分类
    getSameCate = (str) => {
        let _this = this;
        if (str === "ROOT" || !str) str = "A01"
        let obj = {
            url: '/api/shopCategory/shopLevelListByCategoryNo/' + str,
            type: 'get',
            success: function (data) {
                let tmpRes = tools.arrDiff(data, "categoryNo")
                if (str.indexOf("C") > 0) {
                    _this.setState({ threeOpts: tmpRes });
                }
                else if (str.indexOf("B") > -1 && str.indexOf("C") < 0) {
                    _this.setState({ twoOpts: tmpRes });
                }
                else if (str.indexOf("A") > -1 && str.indexOf("B") < 0 && str.indexOf("C") < 0) {
                    _this.setState({ oneOpts: tmpRes })
                };
            },
            fail: function () {
                message.warning("获取商城分类失败");
            }
        }
        tools.fetchData(obj)
    }

    getSonCate = (str) => {
        let _this = this;
        if (str === "ROOT") str = "A01"
        let obj = {
            url: '/api/shopCategory/shopCategoryListByCategoryNo/' + str,
            type: 'get',
            success: function (data) {
                let tmpRes = tools.arrDiff(data, "categoryNo");
                // console.log("getSonCate success",data,tmpRes[0].categoryNo)
                if (str.indexOf("B") > -1 && str.indexOf("C") < 0) {
                    _this.setState({ threeOpts: tmpRes });
                    _this.props.form.setFieldsValue({
                        shopThirdName: tmpRes[0].categoryNo,
                    });
                }
                else if (str.indexOf("A") > -1 && str.indexOf("B") < 0 && str.indexOf("C") < 0) {
                    _this.setState({ twoOpts: tmpRes });
                    _this.props.form.setFieldsValue({
                        shopSecondName: tmpRes[0].categoryNo,
                    });
                    _this.changeTwo(tmpRes[0].categoryNo)
                };
            },
            fail: function () {
                message.warning("获取商城分类失败");
            }
        }
        tools.fetchData(obj);
    }

    changeOne = (val) => {
        console.log("one", val)
        this.getSonCate(val)
    }
    changeTwo = (val) => {
        console.log("two", val)
        this.getSonCate(val)
    }
    changeThree = (val) => {
        console.log("three", val)
        this.props.form.setFieldsValue({
            shopThirdName: val,
        });
    }
    render() {

        const { getFieldDecorator } = this.props.form;
        let { detailData, oneOpts, twoOpts, threeOpts, describe, spuPictureList } = this.state;
        let {
            productNo,
            categoryNo,
            brandName,
            productModel,
            productName,
            productSex,
            marketPrice,
            skuList,
            productAttr,
            categoryDetail,
            shopCategoryDetail,
            firstSkuInfoList,
            caseInfos,
            remark
        }
            = detailData;
        // 生成 商品主图 列表
        if (!skuList) skuList = [];
        let tmpArr = tools.arrDiff(Object.assign([], skuList), 'color');
        // 生成 商品主图的 JSX 结构
        let picLists = tmpArr.map((e, i) => {
            return (
                <div className="clearfix" key={e.color + i} >
                    <div className="pic-left">
                        <div><span>颜色：{e.color}</span></div>
                        <div><span>色系：{e.colorSystemName}</span></div>
                    </div>
                    <div className="pic-right">
                        <ul>{this.outPicLi(e.productPicList)}</ul>
                    </div>
                </div>
            )
        })

        // 判断是否是箱包
        let isBox = ("" + categoryNo).substr(0, 3) === "A03" ? true : false;
        let isClothes = ("" + categoryNo).substr(0, 3) === "A01" ? true : false;
        let sizeColumns = []
        let sizeData = [];
        let boxSize = null;
        if (!isBox) {
            //生成表头
            if (skuList[0].sizeMeasureList && skuList[0].sizeMeasureList.length > 0) {
                sizeColumns = [{
                    title: "尺码",
                    dataIndex: 'size',
                    key: '尺码'
                }]
                if (!skuList) skuList = [];
                sizeColumns.push(...skuList[0].sizeMeasureList.map(e => ({
                    title: e.itemName + "(" + e.unitLengthName + ")",
                    dataIndex: e.itemName,
                    key: e.itemName
                })))

                sizeColumns = tools.arrDiff(sizeColumns, 'key')
            }

            //生成表格数据
            let len = skuList.length;
            for (let i = 0; i < len; i++) {
                let temp = {};
                skuList[i].sizeMeasureList = tools.arrDiff(skuList[i].sizeMeasureList, 'itemName')
                skuList[i].sizeMeasureList.forEach(e => {
                    let keyVal = e.itemName;
                    temp[keyVal] = e.itemValue;
                })
                sizeData.push({
                    key: i,
                    size: skuList[i].size,
                    ...temp
                })
            }
        }
        else {
            if (Object.prototype.toString.call(caseInfos) !== "[object Array]") caseInfos = []
            boxSize = caseInfos.map((e, i) => {
                return (<li key={e.sizeTempItemId} >
                    <span>{e.caseAttr}：</span>
                    <Input style={{ width: '70px' }} disabled value={e.caseAttrValue} />
                    <span className="unit-span">&nbsp;</span>
                </li>
                )
            })
        }

        let threeOptsEle = threeOpts.map((ec, i) => {
            return <Option selected={shopCategoryDetail.thirdNo === ec.categoryNo} key={ec.categoryNo} value={ec.categoryNo}>{ec.categoryCName}</Option>
        })
        let twoOptsEle = twoOpts.map((eb, i) => {
            return <Option selected={shopCategoryDetail.secondNo === eb.categoryNo} key={eb.categoryNo} value={eb.categoryNo}>{eb.categoryCName}</Option>
        })
        let oneOptsEle = oneOpts.map((ea, i) => {
            return <Option selected={shopCategoryDetail.firstName === ea.categoryName} key={ea.categoryNo} value={ea.categoryNo}>{ea.categoryCName}</Option>
        })

        return (
            <div className="edit-box">
                {super.renderSpin()}
                {super.renderTip()}
                <notification />
                <Form>
                    <div className="edit-title"><span>商品信息</span></div>
                    <div>
                        <span className="left-span">SPU编号：</span><span className="unit-span">{productNo}</span>
                        <span>品牌：</span><span className="unit-span">{brandName}</span>
                        <span>货号：</span><span className="unit-span">{productModel}</span>
                    </div>
                    <div>
                        <span className="left-span">商品名称：</span>
                        <FormItem>
                            {getFieldDecorator('productName', {
                                rules: [{ required: true, message: '请输入商品名称' }],
                                initialValue: productName
                            })(
                                <Input style={{ width: '500px' }} placeholder="请输入商品名称" name="1232131231232" />
                            )}
                        </FormItem>
                        <span className="red-star">&nbsp;*</span>
                    </div>
                    {categoryDetail ? (<div>
                        <span className="left-span">后台分类：</span>
                        <Select style={{ width: '150px' }} defaultValue={categoryDetail.firstNo} disabled>
                            <Option selected value={categoryDetail.firstNo}>{categoryDetail.firstName}</Option>
                        </Select>
                        <Select style={{ width: '150px' }} defaultValue={categoryDetail.secondNo} disabled >
                            <Option selected value={categoryDetail.secondNo}>{categoryDetail.secondName}</Option>
                        </Select>
                        <Select style={{ width: '150px' }} defaultValue={categoryDetail.thirdNo} disabled>
                            <Option selected value={categoryDetail.thirdNo}>{categoryDetail.thirdName}</Option>
                        </Select>
                        <Select style={{ width: '150px' }} defaultValue={categoryDetail.fourthNo} disabled>
                            <Option selected value={categoryDetail.fourthNo}>{categoryDetail.fourthName}</Option>
                        </Select>

                    </div>) : (<div><span className="left-span">后台分类：</span></div>)}

                    {shopCategoryDetail ? (
                        <div>
                            <span className="left-span">商城分类：</span>
                            <FormItem>
                                {getFieldDecorator('shopFirstName', {
                                    rules: [{ required: true, message: '请选择商城一级分类' }],
                                    initialValue: shopCategoryDetail ? shopCategoryDetail.secondNo ? ("" + shopCategoryDetail.secondNo).split("B")[0] : '' : '',
                                })(
                                    <Select style={{ width: '150px' }} onChange={this.changeOne} >
                                        {oneOptsEle}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('shopSecondName', {
                                    rules: [{ required: true, message: '请选择商城二级分类' }],
                                    initialValue: shopCategoryDetail ? shopCategoryDetail.secondNo ? shopCategoryDetail.secondNo : '' : '',
                                })(
                                    <Select style={{ width: '150px' }} onChange={this.changeTwo} >
                                        {twoOptsEle}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('shopThirdName', {
                                    rules: [{ required: true, message: '请选择商城三级分类' }],
                                    initialValue: shopCategoryDetail ? shopCategoryDetail.thirdNo ? shopCategoryDetail.thirdNo : '' : '',
                                })(
                                    <Select style={{ width: '150px' }} onChange={this.changeThree} >
                                        {threeOptsEle}
                                    </Select>
                                )}
                            </FormItem>
                            <span className="red-star">*</span>
                        </div>
                    ) : (<div><span className="left-span">商城分类：</span></div>)}

                    {productAttr ? (
                        <div>
                            <span className="left-span">新品信息：</span>
                            <span>上市时间：</span>
                            <Select style={{ width: '150px' }} defaultValue={tools.findStrVal(productAttr, "MarketTime", "productAttrValue")} disabled>
                                <Option value={tools.findStrVal(productAttr, "MarketTime", "productAttrValue")}>{tools.findStrVal(productAttr, "MarketTime", "productAttrValue")}</Option>
                            </Select>
                            <span>上市季节：</span>
                            <Select style={{ width: '150px' }} defaultValue={tools.findStrVal(productAttr, "MarketSeason", "productAttrValue")} disabled>
                                <Option value={tools.findStrVal(productAttr, "MarketSeason", "productAttrValue")}>{tools.findStrVal(productAttr, "MarketSeason", "productAttrValue")}</Option>
                            </Select>
                            <span>适合性别：</span>
                            <Select style={{ width: '150px' }} defaultValue={productSex === 0 ? "女性" : productSex === 1 ? "男性" : productSex === 2 ? "中性" : "未知"} disabled >
                                <Option value={productSex === 0 ? "女性" : productSex === 1 ? "男性" : productSex === 2 ? "中性" : "未知"}>{productSex === 0 ? "女性" : productSex === 1 ? "男性" : productSex === 2 ? "中性" : "未知"}</Option>
                            </Select>
                        </div>
                    ) : (<div><span className="left-span">新品信息：</span> </div>)}

                    <div><span className="left-span">原币市场价：</span><span>{marketPrice ? marketPrice : '暂无'}</span></div>
                    <div className="price-table">
                        <span style={{ verticalAlign: 'top' }} className="left-span">规格与价格：</span>
                        <Table columns={this.state.priceColumns} dataSource={firstSkuInfoList} bordered={!false} pagination={false} rowKey={(item, index) => { return item + index }} />
                    </div>
                    <div>
                        <span className="left-span">包装信息：</span>
                        <span>长：</span>
                        <Input style={{ width: '90px' }} disabled value={tools.findStrVal(productAttr, "Length", "productAttrValue")} />
                        <span className="unit-span">&nbsp;{tools.findStrVal(productAttr, "Length", "productAttrUnitName")}</span>
                        <span>宽：</span>
                        <Input style={{ width: '90px' }} disabled value={tools.findStrVal(productAttr, "Width", "productAttrValue")} />
                        <span className="unit-span">&nbsp;{tools.findStrVal(productAttr, "Width", "productAttrUnitName")}</span>
                        <span>高：</span>
                        <Input style={{ width: '90px' }} disabled value={tools.findStrVal(productAttr, "Heigth", "productAttrValue")} />
                        <span className="unit-span">&nbsp;{tools.findStrVal(productAttr, "Heigth", "productAttrUnitName")}</span>
                        <span>重量：</span>
                        <Input style={{ width: '90px' }} disabled value={tools.findStrVal(productAttr, "Weight", "productAttrValue")} />
                        <span className="unit-span">&nbsp;{tools.findStrVal(productAttr, "Weight", "productAttrUnitName")}</span>
                    </div>
                    <div>
                        <span style={{ verticalAlign: 'top' }} className="left-span">包装清单：</span>
                        <TextArea disabled placeholder="包装清单" value={tools.findStrVal(productAttr, "PackingList", "productAttrValue")} style={{ width: '1000px', maxWidth: '1000px', minWidth: '1000px' }} autosize={{ minRows: 3, maxRows: 5 }} />
                    </div>
                    <div className="box-size" style={{ display: isBox ? "block" : "none" }}>
                        <span className="left-span">箱包尺寸：</span>
                        <ul>{boxSize}</ul>
                    </div>
                    <div style={{ display: isBox ? "block" : "none" }}>
                        <span style={{ verticalAlign: 'top' }} className="left-span">箱包备注：</span>
                        <TextArea disabled placeholder="箱包备注" value={remark} style={{ width: '1000px', maxWidth: '1000px', minWidth: '1000px' }} autosize={{ minRows: 3, maxRows: 5 }} />
                    </div>
                    {(isClothes && skuList && skuList[0].sizeMeasureList.length > 0) ? (
                        <div style={{ display: isBox ? "none" : "block" }} className="size-table">
                            <span style={{ verticalAlign: 'top' }} className="left-span">服装测量尺寸：</span>
                            <Table columns={sizeColumns} dataSource={sizeData} pagination={false} bordered={!false} rowKey={(item, index) => { return item + index }} />
                        </div>
                    ) : (<span>&nbsp;</span>)}

                    <div className="main-pics">
                        <span style={{ verticalAlign: 'top' }} className="left-span">商品主图：</span>
                        {/*   图片lsit ⬇ */}
                        <div>
                            {picLists}
                        </div>
                        {/* 图片list ⬆ */}
                    </div>
                    <div className='main-uploadimg'>
                        <span style={{ verticalAlign: 'top' }} className="left-span">商品场景图：</span>
                        <span style={{ color: '#888' }}>场景图长宽比4:3，最小长度为480，分辨率800×800以上，建议使用800*1200，可拖放进行排序。最多上传20张。</span>
                        <div className='upload-wrap'>
                            {spuPictureList.map((item, index) => {
                                return <div className='image-item' key={item}>
                                    <img src={item} />
                                    <span className='img-del' style={{ cursor: 'pointer' }} onClick={() => { this.onDeletes(index) }}>删除</span>
                                </div>
                            })}
                            {this.state.uploadedFile.map((item, index) => {
                                return <div className='image-item' key={index * 1 + 6}>
                                    <img src={item.preview} />
                                    <span className='img-del' style={{ cursor: 'pointer' }} onClick={() => { this.onDelete(index) }}>删除</span>
                                </div>
                            })}
                            <Dropzone
                                onDrop={this.onImageDrop}
                                multiple={true}
                                style={{display: this.state.uploadedFile.length+spuPictureList.length < 20 ? '': 'none'}}
                                className='upload'
                                ref='upfile'
                                accept="image/*">
                                上传
                        </Dropzone>
                        </div>
                    </div>
                    <div className='main-edit'>
                        <span style={{ verticalAlign: 'top' }} className="left-span">详情描述：</span>
                        <KindEditorReactComponent onChange={this.editorChange} contents={describe} uploadJson='/api/picture/uploadERP' />
                        <span className="red-star" style={{ verticalAlign: 'top' }}>&nbsp;*</span>
                    </div>
                    <div className='main-btn'>
                        <Button type='primary' onClick={this.handleImageUpload}>保存</Button><Button onClick={this.cancel}>取消</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create({})(ProductEdit);