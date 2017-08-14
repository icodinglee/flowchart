import React from 'react';
import { connect } from 'react-redux';
class SingleSelect1 extends React.Component{
    constructor(){
        super();
        this.state={
            secondChangeIndex:'0'
        };
        this.selectChange=this.selectChange.bind(this);
    }
    selectChange(event){
        let arr1=(event.target.value).split(';')
        this.setState({
            secondChangeIndex:arr1[0]
        })
    }
    render(){
        let _this=this;
        let item=this.props.singleDatato1;
        let mn=item.dropdown[_this.state.secondChangeIndex].second;
        let optionHtml=[];
        return(<p key={this.props.key}>
            <i>{item.label}:</i>&nbsp;&nbsp;
            <select onChange={this.selectChange}>
                { optionHtml=item.dropdown.map(function (options,index1) {
                    return(
                        <option value={index1+';'+options.firstOption} key={index1}>{options.firstOption}</option>
                    )
                })}
            </select>
            <select>
                { optionHtml=mn.map(function (options,index1) {
                    return(
                        <option value={options} key={index1}>{options}</option>
                    )
                })}
            </select>
        </p>);
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(SingleSelect1);