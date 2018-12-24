import React, { Component } from 'react';
import { Table, Modal, Button, Input, Radio, Tree, Icon, message, Popconfirm } from 'antd';
import ThreeRightTree from './threeRightTree';
import tools from '../../utils/tools'
import MutilsCookie from '../../utils/cookie';
import { is } from 'immutable';
import './index.css'
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;
class Category extends Component {

    constructor() {
        super();
        this.state = {
            showModal: this.showModal.bind(this),
            getPaByNo: this.getPaByNo.bind(this),
            findSon: this.findSon.bind(this),
            listdata: [],//
            addCateName: '',//新增分类名称
            addType: "ONE",//添加分类级别：一级，二级，三级
            addCateNo: '',//此分类下添加子类
            visible: false,//弹框显示
            confirmLoading: false,
            isShowValue: 0,// 分类中 显示/隐藏 的值
            autoExpandParent: true,
            checkedKeys: [],// tree 选中的节点
            queryName: '',
            queryNo: '',
            threePath: '',//添加/编辑 三级 时，弹出框 路径
            backTreeData: [],//返回的没有分级的 左侧 树结构
            treeData: [],//添加三级分类 弹出框 左侧 树
            parentTreeNodes: [],//去重+纵向处理之后的：三级 根据选中的节点，返回的 父节点
            treeNodes: [],//没有处理的：三级 根据选中的节点，返回的 父节点
            selectedKeys: [],
            grossRate: '',
            expandAllKeys: [],
            freightData: [],//返回的运费数据
            freightList: [],//请求的运费数据
            freightArray: [],//保存运费输入框中的值
            operAction: '',
            modifyId: 0,
            title: '',// 弹出框的标题
            freightColumns: [
                {
                    title: '发货地',
                    dataIndex: 'deliveryName',
                    key: 'deliveryName',
                    width: '32%',
                    className: 'table-height first-cell'
                },
                {
                    title: '收货地',
                    dataIndex: 'receiptName',
                    key: 'receiptName',
                    width: '28%',
                    className: 'table-height'
                },
                {
                    title: '运费（欧元）',
                    key: 'fardId',
                    width: '40%',
                    className: 'table-height',
                    filterDropdownVisible: "true",
                    render: (a, b, c) => {
                        return <div><Input size="large" type="number" placeholder="" className="frei-ipt" data-id={b.fareId} onChange={this.onFareIpt} defaultValue={b.freightPrice} /></div>
                    }
                }
            ]
        };
    }
    componentDidMount() {
        this.getList();
        // this.getTreeData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate")
        // pure render
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

    // 获取列表
    getList = (name, num) => {
        let _this = this;
        var params = { num: 'ROOT' }
        if (name) params = { "categoryCName": name }
        if (num && num !== "ROOT") params = { "categoryNo": num }
        if (name && num && num !== "ROOT") params = { "categoryCName": name, "categoryNo": num }
        let obj = {
            url: '/api/shopCategory/list',
            type: 'post',
            token: MutilsCookie.get('userInfo'),
            params: params,
            success: function (data) {
                _this.setState({
                    listdata: _this.findSon(data, 'categoryNo', 'parentCategoryNo')
                })
            },
            fail: function (msg) {
                message.warning("获取列表数据失败：" + msg)
            }
        }
        tools.fetchData(obj);

    }

    // 查询
    queryList = () => {
        let { queryName, queryNo } = this.state;
        this.getList(queryName, queryNo);
    }
    onNameChange = (e) => {
        this.setState({
            queryName: e.target.value
        })
    }
    onNoChange = (e) => {
        this.setState({
            queryNo: e.target.value
        })
    }

    // 将平行数据 转换为 纵向数据
    findSon = (arr = [], no, pNo, selected) => {
        arr.forEach(e => {
            e.grossRate && (e.grossRate = e.grossRate);
            e.key = e[no];
        })
        if (arr.length <= 0 || Object.prototype.toString.call(arr) !== "[object Array]") return;
        var arr1 = arr.filter(e => (e.categoryType ? e.categoryType : e.erpCategoryType) === "ONE");
        var arr2 = arr.filter(e => (e.categoryType ? e.categoryType : e.erpCategoryType) === "TWO")
        var arr3 = arr.filter(e => (e.categoryType ? e.categoryType : e.erpCategoryType) === "THREE")
        var arr4 = arr.filter(e => (e.categoryType ? e.categoryType : e.erpCategoryType) === "FOUR")
        arr1.forEach(e => {
            e.key = e[no];
            if (arr2.length) e.children = (arr2.filter(ea => ea[pNo] === "" + e[no]) || []);
        })
        arr2.forEach(e => {
            e.key = e[no];
            if (arr3.length) e.children = (arr3.filter(ea => ea[pNo] === "" + e[no]) || []);
        })
        arr3.forEach(e => {
            e.key = e[no];
            if (arr4.length) e.children = (arr4.filter(ea => ea[pNo] === "" + e[no]) || []);
        })
        arr4.forEach(e => e.key = e[no]);
        if (no === "categoryNo") {
            arr1.length && (arr1.sort((a, b) => a.sortId - b.sortId));
            arr1.length && arr1.forEach((e, i, a) => {
                if (i === 0) e.next = (a[i + 1] ? a[i + 1]['id'] : "");
                else if (i === a.length - 1) e.prev = a[i - 1] ? a[i - 1]['id'] : "";
                else { e.next = (a[i + 1] ? a[i + 1]['id'] : ""); e.prev = (a[i - 1] ? a[i - 1]['id'] : ""); }
                e.bottom = (a.length > 1 ? a[a.length - 1]['id'] : '')
                e.top = (a.length > 1 ? a[0]['id'] : '');
                if (!e.children) e.children = []
                e.children.length && e.children.sort((a, b) => a.sortId - b.sortId)
                e.children.length && e.children.forEach((e, i, a) => {
                    if (i === 0) e.next = (a[i + 1] ? a[i + 1]['id'] : "");
                    else if (i === a.length - 1) e.prev = a[i - 1] ? a[i - 1]['id'] : "";
                    else { e.next = (a[i + 1] ? a[i + 1]['id'] : ""); e.prev = (a[i - 1] ? a[i - 1]['id'] : ""); }
                    e.bottom = (a.length > 1 ? a[a.length - 1]['id'] : '')
                    e.top = (a.length > 1 ? a[0]['id'] : '')
                })
            })
            arr2.length && arr2.forEach((e) => {
                if (!e.children) e.children = []
                e.children.sort((a, b) => a.sortId - b.sortId)
                e.children.length && e.children.forEach((e, i, a) => {
                    if (i === 0) e.next = (a[i + 1] ? a[i + 1]['id'] : "");
                    else if (i === a.length - 1) e.prev = a[i - 1] ? a[i - 1]['id'] : "";
                    else { e.next = (a[i + 1] ? a[i + 1]['id'] : ""); e.prev = (a[i - 1] ? a[i - 1]['id'] : ""); }
                    e.bottom = (a.length > 1 ? a[a.length - 1]['id'] : '')
                    e.top = (a.length > 1 ? a[0]['id'] : '')
                })
            })

        }
        let filterArr = arr1.length ? arr1 : arr2.length ? arr2 : arr3.length ? arr3 : arr4;
        if (selected) {
            return tools.intoArr(tools.intoArr(tools.intoArr(tools.intoArr(tools.arrDiff(filterArr, 'key')))))
        }
        return tools.arrDiff(filterArr, 'key');
    }

    // 操作功能 添加 显示/隐藏 编辑， 不包含 删除
    action = (e, curData) => {
        switch (e.target.dataset.act) {
            case 'add':
                this.showModal("add", curData);
                break;
            case 'hide':
                if (e.target.innerText === '显示') {
                    this.changeShowStatus(e.target, curData.id, "SHOW");
                }
                else {
                    this.changeShowStatus(e.target, curData.id, "HIDE");
                }
                break;
            case 'modify':
                this.showModal("modify", curData);
                break;
            default: break;
        }
    }
    // 删除操作
    delAction = (e, curData) => {
        if (curData.isDelete) {
            message.warning("无法删除")
            return
        } else {
            this.changeShowStatus(e.target, curData.id, "LOGIDELETE");
        }

    }
    // 更改 显示/隐藏
    changeShowStatus = (tar, id, status) => {
        let _this = this;
        let url = "";
        if (status === "LOGIDELETE") url = "/api/shopCategory/updatedByDataStatus"
        else url = "/api/shopCategory/updatedByStatus";
        let params = {
            "id": id,
            "status": status,
        }
        let obj = {
            url: url,
            type: 'post',
            token: MutilsCookie.get('userInfo'),
            params: params,
            success: function () {
                if (status === "SHOW") {
                    tar.parentNode.parentNode.parentNode.classList.remove("red");
                    tar.innerText = "隐藏"
                } else if (status === "HIDE") {
                    tar.parentNode.parentNode.parentNode.classList.add("red");
                    tar.innerText = "显示"
                }
                else _this.getList();
            },
            fail: function (msg) {
                message.warning("更改状态失败：" + msg)
            }
        }
        tools.fetchData(obj);
    }

    // 获取编辑 详情
    modifyCategory = (curdata) => {
        let _this = this;
        let obj = {
            url: '/api/shopCategory/getShopCategoryByCategoryId/' + curdata.id,
            type: 'get',
            token: MutilsCookie.get('userInfo'),
            params: {},
            success: function (data) {
                let { freightData } = _this.state;
                freightData = [];
                _this.setState({
                    freightData,
                })
                data.flgErpCategoryList.forEach && data.flgErpCategoryList.forEach(e => { e.title = e.erpCategoryCName; e.key = e.erpCategoryNo; })
                _this.setState({
                    addCateName: data.categoryCName,
                    isShowValue: data.status === "SHOW" ? 1 : 0,
                    addCateNo: curdata.parentCategoryNo,
                    modifyId: parseFloat(curdata.id),
                    threePath: data.categoryPath.substr(0, data.categoryPath.lastIndexOf("->")),
                    parentTreeNodes: _this.findSon(tools.arrDiff(data.erpCategoryList, 'erpCategoryNo'), 'erpCategoryNo', 'erpParentNo') || [],
                    treeNodes: tools.arrDiff(data.erpCategoryList, 'erpCategoryNo') || [],
                    expandAllKeys: data.erpCategoryList.map(e => e.erpCategoryNo) || [],
                    checkedKeys: tools.findLastSon(data.erpCategoryList.map(e => e.erpCategoryNo)) || [],
                    freightData: Object.assign([], data.bindCategoryFareResList) || [],
                    freightList: data.bindCategoryFareResList.map(e => ({ fareId: e.fareId, freightPrice: e.freightPrice })) || [],
                    grossRate: (data.grossRate+"").replace("%","")*1 || '0',
                    treeData: _this.findSon(data.flgErpCategoryList, 'erpCategoryNo', 'erpParentNo'),
                })
            },
            fail: function (msg) {
                message.warning("编辑失败：" + msg)
            }
        }
        tools.fetchData(obj);

    }

    // 获取 添加三级/编辑三级 页面列表
    getListByNo = (no) => {
        !no && (no = "ROOT")
        let _this = this;
        let obj = {
            url: '/api/shopCategory/erpCategoryList',
            type: 'get',
            token: MutilsCookie.get('userInfo'),
            params: {},
            success: function (obj) {
                obj.forEach && obj.forEach(e => { e.title = e.erpCategoryCName; e.key = e.erpCategoryNo; })
                _this.setState({
                    treeData: _this.findSon(obj, 'erpCategoryNo', 'erpParentNo')
                })
            }
        }
        tools.fetchData(obj);
    }

    // 弹框 {
    showModal = (act, curdata) => {
        let type = (!curdata || !curdata.categoryType || typeof curdata.categoryType === "object") ? "ROOT" : curdata.categoryType;
        // type：需要给哪一级 添加分类，例如 type=="ONE" 代表添加的是 二级分类'
        this.setState({
            operAction: act,
        })
        if (act === "add") {
            if (type === "TWO") {
                this.getListByNo("ROOT");
                this.getFareData();
            }
            this.setState({
                visible: true,
                addType: type,
                addCateNo: (curdata && curdata.categoryNo) || "ROOT",
                threePath: (curdata && curdata.categoryPath) || '',
                freightData: Object.assign([], this.state.freightData.forEach(e => e.freightPrice = '')),
                freightList: [],
                parentTreeNodes: [],
                title: "新增分类",
                expandAllKeys: [],
                checkedKeys: []
            });
        }
        else if (act === "modify") {
            this.modifyCategory(curdata);// 返回 编辑 页面所需要的数据
            if (curdata.categoryType === "THREE") {
                this.setState({
                    visible: true,
                    addType: 'TWO',
                    title: "编辑分类",
                });
            } else {
                this.setState({
                    visible: true,
                    addType: 'ONE',
                    title: "编辑分类"
                });
            }
        }
        this.setState({
            freightColumns: Object.assign([], this.state.freightColumns)
        })
    }

    // 弹出框 的 确定 事件
    handleOk = () => {
        let _this = this;
        let { treeData, addCateNo, isShowValue , addCateName, parentTreeNodes, treeNodes, checkedKeys, operAction, modifyId, expandAllKeys } = this.state;
        if (!addCateName) { message.warning("分类名称不能为空"); return; }
        if (tools.getByteLen(addCateName) > 40) { message.warning("分类名称过长"); return; }
        let url = "";
        if (operAction === "add") {
            url = '/api/shopCategory/add';
        };
        if (operAction === "modify") url = '/api/shopCategory/updateByCategoryId';

        var params = {}
        if (checkedKeys.length) {
            let { grossRate, freightList } = this.state;
            // if(grossRate*1 === 0 )grossRate="";
            // else 
            grossRate = "" + grossRate;

            if (grossRate.replace(/(^\s*)|(\s*$)/, "") === "") {
                message.warning("请输入费率信息");
                return;
            }else if( parseInt(grossRate,10)<-300 || parseInt(grossRate,10)>300 || (""+grossRate).indexOf(".")>-1){
                message.warning("输入的费率必须为大于-300小于300的整数");
                return;
            }

            if (!freightList || !freightList.length) {
                message.warning("请输入运费信息");
                return;
            } else {
                let { freightList } = this.state;
                let len = freightList.length;
                for (let i = 0; i < len; i++) {
                    if (isNaN(freightList[i].freightPrice) || freightList[i] === undefined || freightList[i].freightPrice === null || ("" + freightList[i].freightPrice).replace(/(^\s*)|(\s*$)/, "") === "") {
                        message.warning("运费信息不全");
                        return;
                    }
                    if (freightList[i].freightPrice * 1 < 0) {
                        message.warning("运费不能小于0");
                        return;
                    }
                }
            }
            if (operAction === "add") {
                params = {
                    "categoryCName": addCateName,
                    "parentCategoryNo": addCateNo,
                    "status": isShowValue === 1 ? "SHOW" : "HIDE",
                    "erpCategoryNos": checkedKeys,
                    "grossRate": ""+parseInt(grossRate,10),
                    "bindCategoryFare": this.state.freightList
                }

            }
            if (operAction === "modify") {
                params = {
                    "bindCategoryFare": this.state.freightList,
                    "categoryCName": addCateName,
                    "categoryId": modifyId,
                    "erpCategoryNos": checkedKeys,
                    "grossRate": ""+parseInt(grossRate,10),
                    "status": isShowValue === 1 ? "SHOW" : "HIDE"
                }
            }

        } else {

            if (operAction === "add") {
                params = {
                    "categoryCName": addCateName,
                    "parentCategoryNo": addCateNo,
                    "status": isShowValue === 1 ? "SHOW" : "HIDE",
                }
            }
            if (operAction === "modify") {
                params = {
                    "categoryCName": addCateName,
                    "categoryId": modifyId,
                    "status": isShowValue === 1 ? "SHOW" : "HIDE",
                }
            }
        }

        let obj = {
            url: url,
            type: 'post',
            token: MutilsCookie.get('userInfo'),
            params: params,
            success: (data) => {
                _this.getList();
                _this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    if (!parentTreeNodes) parentTreeNodes = [];
                    if (!treeNodes) treeNodes = [];
                    if (!checkedKeys) checkedKeys = [];
                    if (!expandAllKeys) expandAllKeys = [];
                    if (!treeData) treeData = [];

                    parentTreeNodes.length = 0;
                    treeNodes.length = 0;
                    checkedKeys.length = 0;
                    expandAllKeys.length = 0;
                    _this.setState({
                        visible: false,
                        confirmLoading: false,
                        addCateName: '',
                        grossRate: '',
                        parentTreeNodes,
                        treeNodes,
                        treeData,
                        checkedKeys,
                        isShowValue: 0,
                        expandAllKeys,
                    });
                }, 100);
            },
            fail: (obj) => {
                message.warning("失败：" + obj)
                this.setState({
                    confirmLoading: false,
                });
            }
        }
        tools.fetchData(obj);
    }

    // 弹出框 的 取消 事件
    handleCancel = () => {
        let { parentTreeNodes, treeNodes, checkedKeys, expandAllKeys, treeData } = this.state;
        this.setState({
            visible: false,
        });
        setTimeout(function () {
            if (!parentTreeNodes) parentTreeNodes = [];
            if (!treeNodes) treeNodes = [];
            if (!checkedKeys) checkedKeys = [];
            if (!expandAllKeys) expandAllKeys = [];
            if (!treeData) treeData = [];

            parentTreeNodes.length = 0;
            treeNodes.length = 0;
            checkedKeys.length = 0;
            expandAllKeys.length = 0;
            // treeData.length = 0;

            this.setState({
                addCateName: '',
                grossRate: '',
                parentTreeNodes,
                treeNodes,
                checkedKeys,
                isShowValue: 0,
                expandAllKeys,
                treeData,
            })
        }.bind(this), 100)
    }

    onShowChange = (e) => {
        this.setState({
            isShowValue: e.target.value,
        });
    }
    // 弹框 }

    // tree {

    renderTreeNodes = (data) => {
        if (!data) {
            data = [];
            data.length = 0;
            return;
        }
        if (data.map) {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode title={item.erpCategoryCName} key={item.key} dataRef={item} isLeaf={item.erpCategoryType === "FOUR" ? true : false} disabled={item.isBindStatus}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={item.erpCategoryCName} key={item.key} dataRef={item} isLeaf={item.erpCategoryType === "FOUR" ? true : false} disabled={item.isBindStatus} />;
            });
        }
    }

    onCheck = (checkedKeys) => {
        let { getPaByNo, parentTreeNodes, treeNodes, selectedKeys } = this.state;
        if (!parentTreeNodes) parentTreeNodes = [];
        if (!treeNodes) treeNodes = [];
        if (!selectedKeys) parentTreeNodes = [];
        parentTreeNodes = [];
        treeNodes = [];
        selectedKeys = [];

        this.setState({
            parentTreeNodes,
            treeNodes,
            selectedKeys,
        })
        if (checkedKeys.forEach) {
            checkedKeys.forEach(e => getPaByNo(e))
        }
        this.setState({ checkedKeys });
    }

    // 获取运费信息
    getFareData = () => {
        let _this = this;
        let obj = {
            url: '/api/fare/list',
            type: 'post',
            token: MutilsCookie.get('userInfo'),
            success: function (data) {
                data.sort((a, b) => a.sort - b.sort);
                _this.setState({
                    freightData: data
                })
            },
            fail: function (msg) {
                message.warning("获取运费信息失败：" + msg)
            }
        }
        tools.fetchData(obj);
    }

    //根据id 获取所有父级
    getPaByNo = (no) => {
        let _this = this;
        if (!no) return;
        let { parentTreeNodes, findSon, treeNodes } = this.state;
        if (!parentTreeNodes) parentTreeNodes = [];
        if (!treeNodes) treeNodes = [];
        let obj = {
            url: '/api/shopCategory/findAllTypeCategoryByErpCategoryNo/' + no,
            type: 'get',
            token: MutilsCookie.get('userInfo'),
            success: function (data) {
                treeNodes.push(...data);
                parentTreeNodes.push(...data);
                _this.setState({
                    parentTreeNodes: findSon(tools.arrDiff(parentTreeNodes, 'erpCategoryNo'), 'erpCategoryNo', 'erpParentNo'),
                    treeNodes: tools.arrDiff(treeNodes, 'erpCategoryNo'),
                    expandAllKeys: tools.arrDiff(treeNodes, 'erpCategoryNo').map(e => e.erpCategoryNo)
                })
            },
        }
        tools.fetchData(obj);

    }

    onAddChange = (e) => {
        this.setState({
            addCateName: e.target.value,
        });
    }

    // onRateChange
    onRateChange = (e) => {
        // console.log(e.target.value)
        this.setState({
            grossRate: e.target.value,
        })
    }

    onFareIpt = (e) => {
        let { freightList } = this.state;
        let idx = parseFloat(e.target.dataset.id);
        let val = parseFloat(e.target.value);
        freightList.length = 6;
        for (var i = 0; i < freightList.length; i++) {
            if (i === idx - 1) {
                freightList[i] = {
                    "fareId": i + 1,
                    "freightPrice": val
                }
            }
            else if (("" + freightList[i]).replace(/(^\s*)|(\s*$)/, "") === "" || freightList[i] === null || freightList[i] === undefined) {
                freightList[i] = {
                    "fareId": i + 1,
                    "freightPrice": ""
                }
            }
        }
        this.setState({
            freightList: tools.arrDiff(freightList, 'fareId')
        })
    }

    // move
    moveRow = (e, o) => {
        let _this = this;
        let tarId = '', direaction = '';
        switch (e.target.dataset.move) {
            case 'TOP':
                if (o.top === o.id) { message.warning('已经是第一个'); return; }
                tarId = o.top;
                direaction = 'TOP';
                break;
            case 'UP':
                if (!o.prev) { message.warning('已经是第一个'); return; }
                tarId = o.prev;
                direaction = 'UP';
                break;
            case 'DOWN':
                if (!o.next) { message.warning('已经是最后一个'); return; }
                tarId = o.next;
                direaction = 'DOWN';
                break;
            case 'BOTTOM':
                if (o.bottom === o.id) { message.warning('已经是最后一个'); return; }
                tarId = o.bottom;
                direaction = 'BOTTOM';
                break;
            default: break;
        }
        let params = {
            "categoryId": o.id,
            "categorySort": direaction,
            "targetCId": tarId
        }
        let obj = {
            url: '/api/shopCategory/moveShopCategory',
            type: 'post',
            token: MutilsCookie.get('userInfo'),
            params: params,
            success: function () {
                _this.getList();
                message.success('移动成功');
            },
            fail: function () {
                message.error('移动失败');
            }
        }
        tools.fetchData(obj);

    }

    // 子组件 中更改数据
    changeData = (a, b, c, d) => {
        let { treeNodes, parentTreeNodes, checkedKeys, selectedKeys } = this.state;
        if (!treeNodes) treeNodes = [];
        if (!parentTreeNodes) parentTreeNodes = [];
        if (!checkedKeys) checkedKeys = [];
        if (!selectedKeys) selectedKeys = [];
        if (!a) a = []; if (!b) b = []; if (!c) c = []; if (!d) d = [];
        treeNodes.length = a.length || 0;
        parentTreeNodes.length = b.length || 0;
        checkedKeys.length = c.length || 0;
        selectedKeys.length = d.length || 0;
        this.setState({
            treeNodes: a,
            parentTreeNodes: b,
            checkedKeys: c,
            selectedKeys: d,
        })
    }

    onExpand = (arr) => {
        this.setState({
            expandAllKeys: arr,
            autoExpandParent: false,
        })
    }
    render() {
        let { listdata, visible, confirmLoading, selectedKeys, addType, checkedKeys, addCateName, queryName, queryNo, threePath, parentTreeNodes, grossRate, freightData, treeNodes, expandAllKeys } = this.state;

        const columns = [{
            title: '分类名称',
            dataIndex: 'categoryCName',
            key: 'categoryCName',
            width: 'auto',
            className: "text-first-center col-name"
        }, {
            title: '分类代码',
            dataIndex: 'categoryNo',
            key: 'categoryNo',
            width: '10%',
            className: "text-first-center col-cate-no"
        }, {
            title: '基准毛利率',
            dataIndex: 'grossRate',
            key: 'grossRate',
            width: '10%',
            className: "text-center"
        }, {
            title: '基础运费',
            dataIndex: 'freight',
            key: 'freight',
            width: '10%',
            className: "text-center"
        }, {
            title: '总SKU数',
            dataIndex: 'skuTotal',
            key: 'skuTotal',
            width: '8%',
            className: "text-center"
        }, {
            title: '上架SKU数',
            dataIndex: 'skuOnShelves',
            key: 'skuOnShelves',
            width: '8%',
            className: "text-center"
        }, {
            title: '未上架SKU数',
            dataIndex: 'skuOffShelves',
            key: 'skuOffShelves',
            width: '8%',
            className: "text-center"
        }, {
            title: '最高售价',
            dataIndex: 'highSalesPrice',
            key: 'highSalesPrice',
            width: '8%',
            className: "text-center"
        }, {
            title: '最低售价',
            dataIndex: 'lowSalesPrice',
            key: 'lowSalesPrice',
            width: '8%',
            className: "text-center"
        }, {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            width: '10%',
            className: "text-center operate",
            render: (a, b, c) => {
                if (b.categoryType === "THREE") {
                    return (
                        <div onClick={e => this.action(e, b)} data-hidden={b.isDelete}>
                            <span className="add-none" style={{ visibility: 'hidden' }}>&nbsp;</span>&nbsp;&nbsp;
                            <span className="hide" data-act="hide" >{b.status === "HIDE" ? '显示' : '隐藏'}</span>&nbsp;&nbsp;
                            <span className="modify" data-act="modify" >编辑</span>&nbsp;&nbsp;
                            <Popconfirm onConfirm={e => this.delAction(e, b)} title="确定要删除吗？" icon={<Icon type="question-circle-o" style={{ color: 'red', visibility: b.isDelete ? 'hidden' : '' }} />}>
                                <span className="delete" data-act="delete" style={{ visibility: b.isDelete ? 'hidden' : '' }}>删除</span>
                            </Popconfirm>
                        </div>
                    )
                }
                return (
                    <div onClick={(e) => this.action(e, b)} data-hidden={b.isDelete}>
                        <span className="add" data-act="add" >添加子项</span>&nbsp;&nbsp;
                        <span className="hide" data-act="hide" >{b.status === "HIDE" ? '显示' : '隐藏'}</span>&nbsp;&nbsp;
                        <span className="modify" data-act="modify" >编辑</span>&nbsp;&nbsp;
                        <Popconfirm onConfirm={e => this.delAction(e, b)} title="确定要删除吗？" icon={<Icon type="question-circle-o" style={{ color: 'red', visibility: b.isDelete ? 'hidden' : '' }} />}>
                            <span className="delete" data-act="delete" style={{ visibility: b.isDelete ? 'hidden' : '' }}>删除</span>
                        </Popconfirm>
                    </div>
                )
            }
        },
        {
            title: "移动",
            dataIndex: 'move',
            key: 'move',
            width: '10%',
            className: "text-center operate",
            render: (a, b, c) => {
                return (
                    <div className="move-btn" onClick={e => this.moveRow(e, b)} >
                        <span><strong>移到最前</strong><Icon type="up-square-o" data-move="TOP" /></span>
                        <span><strong>上移一行</strong><Icon type="arrow-up" data-move="UP" /></span>
                        <span><strong>下移一行</strong><Icon type="arrow-down" data-move="DOWN" /></span>
                        <span><strong>移到最后</strong><Icon type="down-square-o" data-move="BOTTOM" /></span>
                    </div>
                )
            }
        }
        ];

        return (
            <div className="cate-div" >
                <div className="cate-ipt-div">
                    <label className="cate-ipt">分类名称：<Input size="large" placeholder="分类名称" onChange={this.onNameChange} value={queryName} /></label> <label className="cate-ipt">分类代码：<Input size="large" placeholder="分类代码" onChange={this.onNoChange} value={queryNo} /></label> <Button onClick={this.queryList}>查询</Button>
                </div>
                <div className="add-one-level">
                    <Button onClick={e => this.showModal("add")} className="add-one-btn">添加一级分类</Button>
                </div>
                <Table pagination={false} columns={columns} dataSource={listdata} rowClassName={(r, i) => r.status === "HIDE" ? " red" : " "} />

                <Modal title={this.state.title}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    width={addType === 'TWO' ? '1028px' : '544px'}
                    height={addType === 'TWO' ? '544px' : '230px'}
                    style={{ 'overflow': addType === 'TWO' ? 'scroll' : 'hidden' }}
                    destroyOnClose={!!true}
                    className={addType === 'TWO' ? ' fixed' : ''}
                >
                    <div style={{ display: addType === 'TWO' ? 'none' : 'block' }} >
                        <label className="cate-ipt">分类名称：<Input size="large" placeholder="分类名称" value={addCateName} onChange={this.onAddChange} /></label>
                    </div>
                    <div className="tree-div" style={{ display: addType === 'TWO' ? 'block' : 'none' }}>
                        {/* 商城分类 */}
                        <div><span>商城分类：{threePath}-></span><Input size="large" className="cate-val" placeholder="三级分类" value={addCateName} onChange={this.onAddChange} /></div>
                        <div className="linked-cate-div"><span>关联分类：</span><span className="linked-category">后台分类</span><span className="linked-category">关联后的后台分类</span></div>
                        <div className="ThreeTrees">
                            <Tree
                                checkable
                                expandRowByClick={!!true}
                                onCheck={this.onCheck}
                                checkedKeys={checkedKeys}
                                onExpand={this.onExpand}
                                expandedKeys={expandAllKeys}
                                autoExpandParent={this.state.autoExpandParent}
                            >
                                {this.renderTreeNodes(this.state.treeData)}
                            </Tree>
                        </div>
                        <div className="selected-tree-nodes">
                            <ThreeRightTree parentTreeNodes={parentTreeNodes} checkedKeys={checkedKeys} selectedKeys={selectedKeys} expandAllKeys={expandAllKeys} treeNodes={treeNodes} findSon={this.findSon} changeData={this.changeData} onCheck={this.onCheck} />
                        </div>
                    </div>

                    {/* 基准毛利率 */}
                    <div style={{ display: addType === 'TWO' ? 'block' : 'none' }}>
                        <span className="txt gross-txt">基准毛利率:</span><Input type="number" className="gross-val" size="large" placeholder="请输入大于-300小于300的整数" value={grossRate} onChange={this.onRateChange} /><span>&nbsp;%（整数，且大于-300小于300）</span>
                    </div>
                    {/* 运费 */}
                    <div className="freight-table" style={{ display: addType === 'TWO' ? 'block' : 'none' }}>
                        <span className="txt">运费:</span>
                        <Table bordered columns={this.state.freightColumns} dataSource={freightData} pagination={false} />
                    </div>
                    <div>
                        <span className="txt">显示/隐藏:</span>
                        <RadioGroup onChange={this.onShowChange} value={this.state.isShowValue}>
                            <Radio value={1}>显示</Radio>
                            <Radio value={0}>隐藏</Radio>
                        </RadioGroup>
                    </div>
                </Modal>
            </div>

        )
    }
}

export default Category;