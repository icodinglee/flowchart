import React from 'react';
import { connect } from 'react-redux';
import maliang from 'dev/maliang/sdk/main.js';
import api from 'dev/maliang/util/api.js';
import 'dev/maliang/components/dashboard/style/dashboard.scss';
import {showForm} from 'dev/maliang/action/DashboardAction.js';

import { render } from 'react-dom';
import DragResize from 'dev/maliang/components/dashboard/DragResize';
import PropTypes from 'prop-types';

// 从sdk/main.js获取可视化类型
function TypeItem(props) {
    return <option>{props.value}</option>;
};

function TypeList(props) {
    const painterList = props.painterList;
    const typeItems = painterList.map((item, index) =>
      <TypeItem key={index} value={item.name} />
    );
    return (
      <select id='vizType'>
        {typeItems}
      </select>
    );
};

// 从api.js获取流程图类型

class DashboardForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            boardList: [],
            boardComponent: [],
        };
        this.closeForm = this.closeForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        let url = window.location.href;
        let idVal = window.location.search.substr(4);
        let self = this;

        // 如果url参数带id为并且不是面板类型执行的是修改操作，form选项值为原记录值
        if(url.indexOf('id=') >=0){
            api.viz_load(idVal, function (data, resp) {
                if (data && data.type !== "面板") {
                    console.log(data);
                    document.querySelector('#boardName').value = data.name;
                    document.querySelector('#vizType').value =data.type;
                    document.querySelector('#boardType').value = data.board;
                    document.querySelector('#boardComponent').value = data.component;
                }
           })
        }

        // 加载流程图选项
        api.blockboard_list_all(function(data, resp) {
            let len = data.length
            if (len > 0  ) {
                const blockData = data;
                self.setState({'boardList':blockData});
                api.component_list_all(blockData[0].board, function (data, resp) {
                    self.setState({'boardComponent':data});
                })
            } else {
                alert('还没创建流程图哦')
            }
        });
    }

    handleChange(event){
        let self= this;
        event.preventDefault();
        event.stopPropagation();
        const board = event.target.value;
        //Component组件列表根据流程图类型改变而改变
        api.component_list_all(board, function (data, resp) {
            self.setState({'boardComponent':data});
        })
    }
    //关闭遮罩层以及弹窗表单
    closeForm(){
        this.props.addChart(false);
    }
    saveForm(){
        let chartFormId = this.props.chartFormId;
        let boardName = document.querySelector('#boardName').value,
            vizType = document.querySelector('#vizType').value,
            boardComponent = document.querySelector('#boardComponent').value;
        let self = this;
        if(boardName!='' && boardName!=null){
            api.viz_save(chartFormId, boardName, vizType, boardComponent, null, function(data, resp){
                console.log(data);
                console.log('chartFormId' + chartFormId);
                if (chartFormId===null) {
                    self.props.addChart(true, data.id)
                }else {
                    self.setState({
                        showForm: false
                    });
                    self.props.dispatch(showForm(self.state.showForm));
                }

            } )
        }else {
            alert('请输入名称！');
        }
    }

    render(){
        const painterList = maliang.painter_list;

        return(

            <div className='dashboardForm'>
                <div className='mask'></div>
                <div  className='formContent'>
                    <i className='closeForm' onClick={this.closeForm}>X</i>
                    <p>添加新选项</p>
                    <label>
                        <p>名称：</p>
                        <input
                        type='text'
                        placeholder='请输入名称'
                        name=''
                        id='boardName'
                        required />

                    </label>
                    <label>
                        <p>可视化类型：</p>
                        <TypeList painterList={painterList} />
                    </label>
                    <label>
                        <p>流程图：</p>
                        <select onChange={this.handleChange} id='boardType'>
                            {
                                this.state.boardList.map(function(item, index){
                                    return (<option className='options' key={item.board} value={item.board}>{item.name}</option>)
                                })
                            }
                        </select>
                    </label>
                    <label>
                        <p>组件：</p>
                        <select id='boardComponent'>
                            {
                                this.state.boardComponent.map(function(item, index){
                                    return (<option key={item.id} value={item.id}>{item.name}</option>)
                                })
                            }
                        </select>
                    </label>
                    <div className='btngroup'>
                        <button className='cancelForm' value = 'Cancel' onClick={this.closeForm}>Cancel</button>
                        <button className='saveForm'  value = 'Save' onClick={this.saveForm.bind(this)}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(DashboardForm);

// export default DashboardForm;
