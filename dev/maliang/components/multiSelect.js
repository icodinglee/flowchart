import React from 'react';
import { connect } from 'react-redux';
import {multiSelectData} from 'dev/maliang/action/FlowChartAction';

class MultiSelect extends React.Component{
    constructor(){
        super();
        this.state={
            multiValues:[],
            secondChangeIndex:'0'
        };
        this.multiChange=this.multiChange.bind(this);
        this.multiClick=this.multiClick.bind(this);
        this.selectChange=this.selectChange.bind(this);
    }
    selectChange(event){
        let arr1=(event.target.value).split(';')
        this.setState({
            secondChangeIndex:arr1[0],
            multiValues:''
        });
        let item=this.props.multiDatato;
        this.props.dispatch(multiSelectData({
            key:item.label,
            multiValue1:event.target.value
        }))
    }
    multiChange(){
        let item=this.props.multiDatato;
        let id1=item.id;
        let select = document.getElementById(id1);
        const str = [];
        for(let i=0;i<select.options.length;i++){
            if(select.options[i].selected){
                str.push(select[i].value);
            }
        }
        this.setState({
            multiValues:str
        })
    }
    multiClick(index){
            let arr=this.state.multiValues;
           let arr1= arr.splice(index,1);
            this.setState({multiValues:arr})

    }
    render(){
        let _this=this;
        let item=this.props.multiDatato;
        let mn=item.dropdown[_this.state.secondChangeIndex].second;
        let multioptionHtml=[];
        let optionHtml=[];
        return(<p><i>{item.label}:</i>&nbsp;&nbsp;
            <select onChange={this.selectChange}>
                { optionHtml=item.dropdown.map(function (options,index1) {
                    return(
                        <option value={index1+';'+options.firstOption} key={index1}>{options.firstOption}</option>
                    )
                })}
            </select>

            <select multiple="multiple" size="3" onChange={_this.multiChange} id={item.id} >
                { optionHtml=mn.map(function (options,index1) {
                    return(
                        <option value={options} key={index1}>{options}</option>
                    )
                })}
            </select>
            {multioptionHtml=_this.state.multiValues&&_this.state.multiValues.map(function(multiItem,multiIndex){
             return(<i key={multiIndex} className="multiSpan">{multiItem}&nbsp;&nbsp; <a href="javascript:void(0)" onClick={_this.multiClick.bind(_this,multiIndex)}>X</a></i>
                ) })}
        </p>);
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(MultiSelect);
