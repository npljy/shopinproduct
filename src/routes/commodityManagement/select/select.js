import React,{Component} from 'react';
import { Select, Form, Col } from 'antd';
import './select.css'

const FormItem = Form.Item;
const Option = Select.Option;

class DropDown extends Component{
    constructor ( props ) {
        super( props )
        console.log(props, 'selxt')
        this._onChange = this._onChange.bind(this);
        // console.log(props, 'react-select');
    }
    _onChange (value) {
        const _this = this;
        _this.props.change(_this.props.index, value.key);
    }
    render () {//initialValue: { key: '' },//初始值
        const _this = this;
        let {_getFieldDecorator, id, data, value, index} = this.props;
        var defaultLabel = '一级分类';
        if (index==1) {
            defaultLabel = '二级分类';
        }else if (index == '2') {
            defaultLabel = '三级分类';
        }
        return <Col className='cdr-col' span={_this.props.wrapperCol-2}>
            <FormItem>
                {_getFieldDecorator(id, {
                    rules: [{type: 'object'}],//校验规则
                    initialValue: {key: value ? value : defaultLabel, label: ''}
                })(
                    <Select
                    labelInValue={true}
                    onChange={this._onChange}
                    >
                        {data.map((item, index)=>{
                            return <Option key={item.categoryNo}>{item.categoryCName}</Option>
                        })}
                    </Select>
                )}
            </FormItem>
        </Col>
    }
}
export default DropDown;