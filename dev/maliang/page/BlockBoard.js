import React from 'react';
import { connect } from 'react-redux';
import api from 'dev/maliang/util/api';
import ConfigPopup from 'dev/maliang/components/ConfigPopup';
import AddToComponentPopup from 'dev/maliang/components/addToComponentPopup';
import Menu from 'dev/maliang/components/contextMenu';
import Flowchart from 'dev/maliang/components/flowchart/main';
import {Tree, TreeNode} from 'dev/components/tree.jsx';

class BlockBoard extends React.Component{
    constructor(){
     super();
     this.state={
         component_list:[],
         gData:[],
     };
     this.onDragEnter=this.onDragEnter.bind(this);
     this.onExpand=this.onExpand.bind(this);
     this.onDragEnd=this.onDragEnd.bind(this);
    }
    setMaliangComponent(c) {
      this.setState({component_list:c});
    }
    allowDrap(event){
        event.preventDefault()
    }
    componentWillMount(){
        let _this=this;
        api.block_types(function (data) {
                _this.setState({
                    gData: data
                })
            })
    }
    save() {
      var flowchart = this.refs.flowchart;
      flowchart.save.call(flowchart);
    }
    onDragEnd(data) {
        let leftDiv=document.getElementsByClassName('left')[0];
        let leftDivWidth=parseInt(leftDiv.style.width);
        let x=data.event.clientX;
        let y=data.event.clientY;
        //开始在流程图创建节点
        if(x>leftDivWidth){
            this.refs.flowchart.createNode({signature: data.node.props.eventKey, left:x, top:y, name:data.node.props.title});
        }
    }
    onDragStart(info) {
      if (!info.node.props.isLeaf) {
        info.event.preventDefault();
      }
    }
    onDragEnter(info) {
        this.setState({
            expandedKeys: info.expandedKeys,
        });
    }
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    render(){
        const loop = data => {
            return data&&data.map((item) => {
                if (item.items && item.items.length) {
                    return <TreeNode key={item.title} title={item.title} >{loop(item.items)}</TreeNode>;
                }
                return <TreeNode className='treeNode' key={item.type} title={item.text} isLeaf={true} />;
            });
        };
        return(
            <div>
                <div className="btnArea">
                    <div className="btnleft">
                        <button onClick={this.save.bind(this)}>保存</button>
                    </div>
                    <div className="btnright">
                        {this.state.component_list}
                    </div>
                </div>
                <div className="Content">
                   {/*左边是目录，右边是拖拽框*/}
                   <ConfigPopup ref='config_modal'/>
                   <AddToComponentPopup ref='add_component_modal'/>
                   <Menu ref='menu'/>
                    <div className="right" onDragOver={this.allowDrap} >
                      <Flowchart ref='flowchart' add_component_modal={this.refs.add_component_modal} config_modal={this.refs.config_modal } menu={this.refs.menu} maliang_component_func={this.setMaliangComponent.bind(this)}/>
                    </div>
                    <div className="left" style={{width:200}}>

                <Tree
                    defaultExpandAll={true}
                    showIcon={false}
                    selectable={false}
                    draggable
                    onDragStart={this.onDragStart} onDragEnter={this.onDragEnter}
                    onDragEnd={this.onDragEnd}>
            {loop(this.state.gData)}
                </Tree>
                    </div>
                </div>
        </div>)
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(BlockBoard);
