import React ,{Component} from 'react';
import {Tree} from 'antd';
import tools from '../../utils/tools'
const TreeNode = Tree.TreeNode;

export default class ThreeRightTree extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    renderTreeNodes = (data) => {
        if (!data) {
            data = [];
            data.length = 0;
            return;
        }
        if (data.map) {
            return data.map((item) => {
                // console.log(!!item.children)
                if (item.children) {
                    return (
                        <TreeNode title={item.erpCategoryCName} key={item.key} dataRef={item} isLeaf={item.erpCategoryType === "FOUR" ? true : false} >
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={item.erpCategoryCName} key={item.key} dataRef={item} isLeaf={item.erpCategoryType === "FOUR" ? true : false} />;
            });
        }else{
            return [];
        }
    }
    onSelect = (selectedKeys, info) => {
        let { checkedKeys, treeNodes,findSon,changeData } = this.props;
        treeNodes.forEach(e => { if (e.children) e.children.length = 0 });
        //如果删除的是一级,查出其所有的二级三级四级，然后删除
        let delArr = treeNodes.filter(e => e.erpCategoryNo === selectedKeys[0]);
        //找见他的下面所有级

        let firstArr = treeNodes.filter(e => {
            if(e.erpParentNo && delArr[0].erpCategoryNo)
            return e.erpParentNo === delArr[0].erpCategoryNo
        });
        let secondArr = [];
        firstArr.forEach(e => {
            if(e.erpParentNo && delArr[0].erpCategoryNo)
            secondArr.push(...treeNodes.filter(ei => ei.erpParentNo === e.erpCategoryNo));
        })
        let thirdArr = [];
        secondArr.forEach(e => {
            if(e.erpParentNo && delArr[0].erpCategoryNo)
            thirdArr.push(...treeNodes.filter(ei => ei.erpParentNo === e.erpCategoryNo));
        })
        let fourthArr = [];
        thirdArr.forEach(e => {
            if(e.erpParentNo && delArr[0].erpCategoryNo)
            fourthArr.push(...treeNodes.filter(ei => ei.erpParentNo === e.erpCategoryNo));
        })
        let allDelArr = [...delArr, ...firstArr, ...secondArr, ...thirdArr, ...fourthArr];
        let newTreeNodes = tools.twoArrDiff(treeNodes,allDelArr);
        !newTreeNodes.length && (checkedKeys.length = 0);
        let newPTN = findSon( tools.arrDiff(newTreeNodes,'erpCategoryNo'), 'erpCategoryNo', 'erpParentNo', true);
        let superKey ="";
        let newCheckedKeys=[];
        if(selectedKeys[0].indexOf("D")>0){
            superKey = selectedKeys[0].split("D")[0];
            newCheckedKeys = checkedKeys.filter(e => e !== selectedKeys[0] && e != superKey );
        }else{
            newCheckedKeys = checkedKeys.filter(e => {
                return e.split("B")[0] !== selectedKeys[0] && e.split("C")[0] !== selectedKeys[0] && e.split("D")[0] !== selectedKeys[0] && e != superKey
            } );
        }
        changeData(
            newTreeNodes,
            newPTN,
            newCheckedKeys,
            selectedKeys
        )
    }
    render(){
        return(
            <Tree onSelect={this.onSelect} expandedKeys={this.props.expandAllKeys} >
                {this.renderTreeNodes(this.props.parentTreeNodes)}
            </Tree>
        )
    }
}