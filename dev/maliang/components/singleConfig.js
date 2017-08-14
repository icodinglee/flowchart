import React from 'react';
import { connect } from 'react-redux';

class SingleConfig extends React.Component{
    constructor(){
        super();
        this.state={
            isChecked:false,
            secondChangeIndex:'0'
        };
        this.change=this.change.bind(this);
        this.selectChange=this.selectChange.bind(this);
    }
    change(){
        this.setState({
            isChecked:!this.state.isChecked
        })
    }
    selectChange(event){
        let arr1=(event.target.value).split(';')
        this.setState({
            secondChangeIndex:arr1[0]
        })
    }
    render(){
        let _this=this;
        let item=this.props.thisData;
        let mn=item.dropdown[_this.state.secondChangeIndex].second;
        let dropdownStyle=this.state.isChecked?{display:'none'}:{display:'inline'};
        let inputstyle=this.state.isChecked?{display:'inline'}:{display:'none'};
        let configHtml=[];
        let optionHtml=[];
        return(<p key={this.props.key}>
            <i>{item.label}:</i>&nbsp;&nbsp;
            <input type="text" style={inputstyle}/>
            <select style={dropdownStyle} onChange={this.selectChange}>
                { optionHtml=item.dropdown.map(function (options,index1) {
                    return(
                        <option value={index1+';'+options.firstOption} key={index1}>{options.firstOption}</option>
                    )
                })}
            </select>
            <select style={dropdownStyle}>
                { optionHtml=mn.map(function (options,index1) {
                    return(
                        <option value={options} key={index1}>{options}</option>
                    )
                })}
            </select>
            <em>切换输入方式</em>
            <input type="checkbox" checked={_this.state.isChecked} onChange={_this.change} className="switchway"/>
        </p>);
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(SingleConfig);
