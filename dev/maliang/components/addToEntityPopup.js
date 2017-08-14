import React from 'react';
import { connect } from 'react-redux';
import {PopupClass} from 'dev/maliang/components/Popup.js';

class AddToEntityPopup extends PopupClass {
    constructor() {
      super();
    }

    pressOk() {
      let is_new_entity = this.state.create_entity;
      if (is_new_entity) {
        if (!this.new_entity_type) {
         alert('没有选择组件类型');
         return;
        } else
          this.return_func(this.block_id, this.state.create_entity, {name:this.state.new_entity_name, type:this.new_entity_type});
      } else {
        if (!this.select_entity_id)
          this.select_entity_id = this.entity_list[0].key;
        this.return_func(this.block_id, this.state.create_entity, {id:this.select_entity_id});
      }

      super.pressOk();
    }

    show(options) {
      this.setState({new_entity_name:options.block_name});
      this.entity_list = options.entity_list;
      this.state.create_entity = (this.entity_list.length > 0) ? false : true;

      this.setTitle('绑定组件');
      this.entity_types = options.entity_types;
      this.block_id = options.block_id;
      this.return_func = options.return_func;
      super.show(options);
    }

    setCreateEntity() {
      this.setState({create_entity:!this.state.create_entity});
    }

    setEntityType(event) {
      this.setState({create_entity:true});
      this.new_entity_type = event.target.value;
    }

    setEntityName(event) {
      this.setState({create_entity:true});
      this.setState({new_entity_name:event.target.value});
    }

    selectEntity(event) {
      this.setState({create_entity:false});
      this.select_entity_id = event.target.value;
    }

    renderContent() {
      let entity_types = this.entity_types;
      let entity_list = this.entity_list;
      return (
               <div>
                 <div style={{display:(entity_list.length>0) ? 'inline' : 'none'}}>
                   <label><input type='radio' onChange={this.setCreateEntity.bind(this)} checked={!this.state.create_entity} value={true}/>绑定已有组件</label>
                         <select onChange={this.selectEntity.bind(this)}>
                         {
                            entity_list.map(
                               function(item, int) {
                                 return <option value={item.key} key={item.key}>{item.props.name}</option>
                            })
                         }
                         </select>
                 </div>
                 <p/>

                 <div>
                   <label><input type='radio' onChange={this.setCreateEntity.bind(this)} checked={this.state.create_entity} value={true}/>新建组件</label>
                 </div>
                 <div>
                         <label>组件名称</label><input type='text' onChange={this.setEntityName.bind(this)} value={this.state.new_entity_name} />
                 </div>
                 <div>
                         <label>组件类型</label>
                         <select defaultValue='choose' onChange={this.setEntityType.bind(this)}>
                         <option disabled value='choose' >选择类型</option>
                         {
                            Object.keys(entity_types).map(
                               function(key, int) {
                                 let info = entity_types[key];
                                 return <option value={info.signature} key={info.signature}>{info.verbose}</option>
                            })
                         }
                         </select >
                 </div>
               </div>
             )
    }
}

function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps, null, null, { withRef: true })(AddToEntityPopup);
