import React from 'react';
import { connect } from 'react-redux';
import DashboardForm from 'dev/maliang/components/dashboard/DashboardForm.js';
import api from 'dev/maliang/util/api.js';
import $ from 'jquery';
import { render } from 'react-dom';
import DragResize from 'dev/maliang/components/dashboard/DragResize'

class Dashboard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showForm: false, //是否显示新建的表单遮罩层
            showWrap: false, //是否显示底层(含新建和保存按钮的层)
            chartArea: [], //面板矩形框
            chartFormId: null, //新建的表单id
            dragKey: 0, //可拖拽框key值
            dragId: null, //可拖拽框id值
        };
        this.createForm = this.createForm.bind(this);
        this.save = this.save.bind(this);
    }
    componentDidMount() {
        this.vizView();
    }
    //新建按钮
    createForm(){
        this.setState({
            showForm: true,
            chartFormId: null,
        });
    }
    // 保存按钮
    save(){
        alert('你点了保存!');
    }
    // 页面显示内容
    vizView(){
        let url = window.location.href;
        let idVal = window.location.search.substr(4);
        let self = this;
        //如果有id,获取id值后传值到api_viz_load()获取数据判断type类型是否等于panel
        if (url.indexOf('id=') >= 0){
            self.setState({
                showForm: true,
            })
            api.viz_load(idVal,function(data, resp){
                if (data && data.type == "面板") {
                    self.setState({
                        showForm: false,
                        showWrap: true,
                        chartFormId: null,
                    })
                } else {
                    self.setState({
                        showForm: true,
                        showWrap: false,
                        chartFormId: idVal
                    });
                }
            });
        }else {
            //如果没有id,只显示配置表
            self.setState({
                showForm: true,
                showWrap: false,
                chartFormId: null
            })
        }
    }
    // 新建拖拽矩形框
    addChart(createNew, dragBoxId){
        //createNew参数：true新建 false不执行新建
        //dragBoxId: 新建的拖拽框id(点form表单的save按钮时调用viz_save返回的id值)

        if (createNew) {
            let chartArea=this.state.chartArea;
            chartArea.push(<DragResize key={dragBoxId} dragId={dragBoxId} isShow={this.state.showForm}/>);
        }
        this.setState({
            showForm: false,
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({showForm:nextProps.data})
    }
    render(){
        let idVal = window.location.search.substr(4);
        console.log(this.props.chartArea);
        return(
            <div>
                {this.state.showWrap ?
                (<div>
                    <div className='btnList'>
                        <button onClick={this.createForm} className='newBoard'>新建</button>
                        <button onClick={this.save} className='saveBoard'>保存</button>
                    </div>
                    <div className='chartArea' ref='chartArea' >{this.state.chartArea}</div>
                </div>) : null }
                {this.state.showForm ? <DashboardForm chartFormId={this.state.chartFormId} ref='chartForms' addChart={this.addChart.bind(this)} />: ''}
            </div>)
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(Dashboard);
