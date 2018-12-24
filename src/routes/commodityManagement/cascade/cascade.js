import React,{Component} from 'react';
import { Form, Row } from 'antd';
import DropDown from '../select';

const FormItem = Form.Item;

class Cascade extends Component{
    constructor ( props ) {
        super( props )
        this._CascadeChange = this._CascadeChange.bind(this);
    }
    componentWillMount(){  }
    
    _CascadeChange (index, value) {
        const _this = this;
        _this.props._requestDropData(index, value)
    }
    render () {
        const _this = this;
        const formItemLayout = {
            labelCol : {xl: 2, lg: 3, md: 4, sm: 5, xs: 6},
            wrapperCol : {xl: 22, lg: 21, md: 20, sm: 19, xs: 18}
        }
        const { childId, _getFieldDecorator, selectList } = this.props;
        const wrappNum = 24/(childId.length);
        function linkage () {
            return <FormItem {...formItemLayout} label={_this.props.label}>
                <Row>
                    {
                        childId.map((item, index)=>{
                           return <DropDown
                                    id={item}
                                    key={item}
                                    data={selectList[index].data}
                                    value={selectList[index].value}
                                    index={index}
                                    wrapperCol={wrappNum}
                                    change={_this._CascadeChange}
                                    _getFieldDecorator={_getFieldDecorator} />
                        })
                    }
                    {/* <DropDown wrapperCol={wrappNum} id={_this.props.id+'1'} change={_this._CascadeChange1} data={_this.state.DropData[0].data} value={_this.state.DropData[0].value}  />
                    <DropDown wrapperCol={wrappNum} id={_this.props.id+'2'} change={_this._CascadeChange2} data={_this.state.DropData[1].data} value={_this.state.DropData[1].value}  />
                    <DropDown wrapperCol={wrappNum} id={_this.props.id+'3'} change={_this._CascadeChange3} data={_this.state.DropData[2].data} value={_this.state.DropData[2].value}  />
                    { _this.props.linkage == 4 || _this.props.linkage == 5 ? 
                    <DropDown wrapperCol={wrappNum} id={_this.props.id+'4'} change={_this._CascadeChange4} data={_this.state.DropData[3].data} value={_this.state.DropData[3].value}  />
                    : '' }
                    { _this.props.linkage == 5 ? 
                    <DropDown wrapperCol={wrappNum} id={_this.props.id+'5'} change={_this._CascadeChange5} data={_this.state.DropData[4].data} value={_this.state.DropData[4].value} />
                    : '' } */}
                </Row>
            </FormItem>
        }
        const jsx = linkage()
        return jsx;
    }
}

export default Cascade;