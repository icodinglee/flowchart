import React from 'react';
import Rnd from 'react-rnd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import DashboardForm from 'dev/maliang/components/dashboard/DashboardForm';
import Dashboard from 'dev/maliang/page/Dashboard';
import Api from 'dev/maliang/util/api';
import {showForm} from 'dev/maliang/action/DashboardAction.js';

class Box extends React.Component{
  render() {
    return (
      <div>
        <div
          className="dragbox"
          style={{ margin: 0, height: '100%'}}
        >
          <p>{ document.querySelector('#boardName').value }</p>
        </div>
      </div>
    );
  }
}

export default class DragResize extends React.Component{
  constructor(props){
    super(props);
    this.state={
      zIndex: 0,
      chartFormId: null,
      showForm: false,
    };
    this.onContextMenu = this.onContextMenu.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    // this.editItem = this.editItem.bind(this);
    // this.deleteItem = this.deleteItem.bind(this);
  }
  //右键菜单编辑
  editItem(){
    this.setState({
      chartFormId: this.props.dragId,
      showForm: true,
    })

    let self = this;
    Api.viz_load(this.props.dragId, function(data, resp){
      document.querySelector('#boardName').value = data.name;
      document.querySelector('#vizType').value =data.type;
      document.querySelector('#boardType').value = data.board;
      document.querySelector('#boardComponent').value = data.component;
    })
  }
  //右键菜单删除
  deleteItem(){
    console.log('delete');
  }
  getBoxValue(){
    Api.viz_load(this.props.dragId, function(data, resp){
      return data.name;
    })
  }
  onContextMenu(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      zIndex: 1,
    });
  }
  handleMouseOver(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      zIndex: 1,
    });
  }
  handleMouseOut(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      zIndex: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({showForm:nextProps.data})
  }

  render() {
    let contextId = this.props.dragId;
    return(
      <div onContextMenu={this.onContextMenu} onMouseOut={this.handleMouseOut} onMouseOver={this.handleMouseOver}>
        <ContextMenuTrigger id={contextId}>
          <Rnd
            className="well"
            default={{
              x: 10,
              y: 10,
              width: 120,
              height: 40,
            }}
            minWidth={100}
            minHeight={30}
            bounds=".chartArea"
            z={this.state.zIndex}
          >
            <Box />
          </Rnd>
        </ContextMenuTrigger>
        <ContextMenu id={contextId} className='react-contextmenu'>
          <MenuItem onClick={this.editItem.bind(this)}>
            编辑
          </MenuItem>
          <MenuItem onClick={this.deleteItem.bind(this)}>
            删除
          </MenuItem>
        </ContextMenu>
        {this.state.showForm ? <DashboardForm chartFormId={this.state.chartFormId} addChart={this.addChart} />: null}
      </div>
    )
  }
}
