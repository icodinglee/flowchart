import React from 'react';
import { connect } from 'react-redux';
class SingleSelect extends React.Component{
    constructor(){
        super();
        this.state={
            singeSelectValue:''
        };
        this.singleChange=this.singleChange.bind(this)
    }
    singleChange(event){
        this.setState({
            singeSelectValue:event.target.value
        })
    }
    render(){
        let _this=this;
        let item=this.props.singleDatato;
        let optionHtml=[];
        return(<p><i>{item.label}:</i>&nbsp;&nbsp;
            <select onChange={this.singleChange}>
                { optionHtml=item.dropdown.map(function (options,index1) {
                    return(
                        <option value={options} key={index1}>{options}</option>
                    )
                })}
            </select>
            {_this.state.singeSelectValue}
        </p>);
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(SingleSelect);