import React from 'react';
import {Row, Col} from 'antd';
import ERPFormItem from '../../component/ERPFormItem';

export default class Templetes {
    // dataArr 为二维数组
    createComponents(tDArr) {
        let rowProps;

        let itemsCompArr = new Array();

        // 没有自定义row的属性
        if (tDArr[0] instanceof Array) {
            for (let i = 0; i < tDArr.length; i++) {
                let compArr = tDArr[i];

                // 获取二维数组里面的各种参数
                let comp = compArr[0];
                let prams = compArr[1];
                let subComps = null;
                let colProps = null;
                let subCopm = null;

                if (compArr.length > 2) {
                    subComps = compArr[2];
                }
                if (compArr.length > 3) {
                    colProps = compArr[3];
                }
                if (compArr.length > 4) {
                    subCopm = compArr[4];
                }

                if (colProps) {
                    if (Object.getOwnPropertyNames(colProps).length > 0) {
                        if (comp.name === 'ERPFormItem') {
                            itemsCompArr.push(
                                React.createElement(Col, colProps,
                                    React.createElement(ERPFormItem, prams, subComps))
                            );
                        }
                        else {
                            if (subComps instanceof Array) {
                                itemsCompArr.push(
                                    React.createElement(Col, colProps,
                                        React.createElement(comp, prams, this.createCompsWithArray(subComps)))
                                );
                            }
                            else {
                                itemsCompArr.push(
                                    React.createElement(Col, colProps,
                                        React.createElement(comp, prams, subComps))
                                );
                            }
                        }
                    }
                    else {
                        if (comp.name === 'ERPFormItem') {
                            itemsCompArr.push(
                                React.createElement(Col, subCopm.colProps,
                                    React.createElement(ERPFormItem, prams, subComps))
                            );
                        }
                        else {
                            if (subComps instanceof Array) {
                                itemsCompArr.push(
                                    React.createElement(Col, comp.colProps,
                                        React.createElement(comp, prams, this.createCompsWithArray(subComps)))
                                );
                            }
                            else {
                                itemsCompArr.push(
                                    React.createElement(Col, comp.colProps,
                                        React.createElement(comp, prams, subComps))
                                );
                            }
                        }
                    }
                }
                else {
                    if (comp.name === 'ERPFormItem') {
                        itemsCompArr.push(
                            React.createElement(Col, subCopm.colProps,
                                React.createElement(ERPFormItem, prams, subComps))
                        );
                    }
                    else {
                        if (subComps instanceof Array) {
                            itemsCompArr.push(
                                React.createElement(Col, comp.colProps,
                                    React.createElement(comp, prams, this.createCompsWithArray(subComps)))
                            );
                        }
                        else {
                            itemsCompArr.push(
                                React.createElement(Col, comp.colProps,
                                    React.createElement(comp, prams, subComps))
                            );
                        }
                    }
                }
            }
        }
        // 自定义了row的属性
        else {
            rowProps = tDArr[0];

            for (let i = 1; i < tDArr.length - 1; i++) {
                let compArr = tDArr[i];

                // 获取二维数组里面的各种参数
                let comp = compArr[0];
                let prams = compArr[1];
                let subComps = null;
                let colProps = null;
                let subCopm = null;

                if (compArr.length > 2) {
                    subComps = compArr[2];
                }
                if (compArr.length > 3) {
                    colProps = compArr[3];
                }
                if (compArr.length > 4) {
                    subCopm = compArr[4];
                }

                if (colProps) {
                    if (Object.getOwnPropertyNames(colProps).length > 0) {
                        if (comp.name === 'ERPFormItem') {
                            itemsCompArr.push(
                                React.createElement(Col, colProps,
                                    React.createElement(ERPFormItem, prams, subComps))
                            );
                        }
                        else {
                            if (subComps instanceof Array) {
                                itemsCompArr.push(
                                    React.createElement(Col, colProps,
                                        React.createElement(comp, prams, this.createCompsWithArray(subComps)))
                                );
                            }
                            else {
                                itemsCompArr.push(
                                    React.createElement(Col, colProps,
                                        React.createElement(comp, prams, subComps))
                                );
                            }
                        }
                    }
                    else {
                        if (comp.name === 'ERPFormItem') {
                            itemsCompArr.push(
                                React.createElement(Col, subCopm.colProps,
                                    React.createElement(ERPFormItem, prams, subComps))
                            );
                        }
                        else {
                            if (subComps instanceof Array) {
                                itemsCompArr.push(
                                    React.createElement(Col, comp.colProps,
                                        React.createElement(comp, prams, this.createCompsWithArray(subComps)))
                                );
                            }
                            else {
                                itemsCompArr.push(
                                    React.createElement(Col, comp.colProps,
                                        React.createElement(comp, prams, subComps))
                                );
                            }
                        }
                    }
                }
                else {
                    if (comp.name === 'ERPFormItem') {
                        itemsCompArr.push(
                            React.createElement(Col, subCopm.colProps,
                                React.createElement(ERPFormItem, prams, subComps))
                        );
                    }
                    else {
                        if (subComps instanceof Array) {
                            itemsCompArr.push(
                                React.createElement(Col, comp.colProps,
                                    React.createElement(comp, prams, this.createCompsWithArray(subComps)))
                            );
                        }
                        else {
                            itemsCompArr.push(
                                React.createElement(Col, comp.colProps,
                                    React.createElement(comp, prams, subComps))
                            );
                        }
                    }
                }
            }
        }

        let tarRowItem = React.createElement(Row, rowProps, itemsCompArr);

        return tarRowItem;
    }

    createCompsWithArray(dataArr) {
        for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i] instanceof Array) {
                this.createCompsWithArray(dataArr);
            }
            else {
                let comp = null;
                let prams = null;
                let children = null;

                if (dataArr.length > 0) {
                    comp = dataArr[0];
                }
                if (dataArr.length > 1) {
                    prams = dataArr[1];
                }
                if (dataArr.length > 2) {
                    children = dataArr[2];
                }

                if (children instanceof Array) {
                    return this.createComps(comp, prams, this.createCompsWithArray(children));
                    break;
                }
                else {
                    return this.createComps(comp, prams, children);
                    break;
                }
            }
        }
    }

    createComps(comp, props, children) {
        if (children instanceof Array) {
            return React.createElement(comp, props, this.createComps(children[0], children[1], children[2]));
        }
        else {
            return React.createElement(comp, props, children);
        }
    }
};