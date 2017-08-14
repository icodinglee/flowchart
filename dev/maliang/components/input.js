// TODO: select multi 值的存储和还原
//       type=list的实现
import 'bootstrap-tagsinput';

import React from 'react';
import { connect } from 'react-redux';
class InputLine extends React.Component{
    constructor(){
        super();
        this.state = {
                       input_state:0,
                       columns:[]
                     }
    }

    setConfig(data_type, data_value) {
      this.data_type = data_type;
      let data = {data_type:data_type, data_value:data_value};
      if (this.connections && (data_type == 'column' || data_type == 'multi_column')) {
        if (this.config.getAttr('new_value'))
          data.block = this.config.getAttr('new_value').block
        if (!data.block) data.block = this.config.getAttr('value').block;
      }
      this.config.setAttr('new_value', data);
    }

    initList() {
      let self = this;
      let tagsinput = $('#' + this.id + '[data-role=tagsinput][name=input]');
      if (tagsinput.length > 0) {
        this.tagsinput = tagsinput;
        tagsinput.tagsinput({allowDuplicates:true});

        if (this.tagsinput_data) {
          for (let i in this.tagsinput_data) {
            tagsinput.tagsinput('add', this.tagsinput_data[i]);
          }
          this.tagsinput_data = null;
        }

        tagsinput.on('itemAdded', null, function(event) {
          let data_value = $(this).tagsinput('items');
          self.setConfig(event.target.name, data_value);
        });
        tagsinput.on('itemRemoved', null, function(event) {
          let data_value = $(this).tagsinput('items');
          self.setConfig(event.target.name, data_value);
        });
      }
    }

    componentDidUpdate() {
      this.initList();
    }

    componentDidMount() {
      this.initList();
    }

    handleChange(event) {
      var data_type = event.target.name;
      var data_value = event.target.value;
      if (data_type == 'multi_column') {
        data_value = [];
        let options = event.target && event.target.options;

        for (let i in options) {
          if (options[i].selected) {
            data_value.push(options[i].value);
            
          }
        }
        
      }

      this.setConfig(data_type, data_value);
    }

    shiftState() {
      // $('.bootstrap-tagsinput').remove();
      this.setState({input_state: 1 - this.state.input_state});
      this.initDefaultValue();

    }


    getColumns(block_id) {
         var conn = this.connections;
            for (let i in conn)
              if (conn[i].id == block_id)
                return conn[i].columns;
    }
    selectBlock(event) {
      let block_id = event.target.value;
      let columns = this.getColumns(block_id);

      if (!this.update) {
          if (this.type == 'column' && columns.length > 0)
            this.config.setAttr('new_value', {block: event.target.value, data_type:this.type, data_value:columns[0]});
          else
            this.config.setAttr('new_value', {block: event.target.value});
          this.setState({columns:columns});
      } else {
        this.config.setAttr('new_value', {block: event.target.value});
        this.update(columns);
      }
    }

    renderLine() {
        let default_value = this.value;
        this.value = null;
        let default_block = this.block;
        this.block = null;
        let columns = this.getColumns(default_block);
        if (default_block && this.update)
          this.update(columns);
        else {
          this.columns = columns;
        }
        let self=this;
        if (this.type == 'block')
          return this.renderBlock(default_block)
        let inputs = [];
        if (this.type == 'text' || this.type == 'list' || this.type == 'list_only') {
           if (this.state.input_state == 0 || this.type == 'list_only')
             switch(this.type) {
               case 'text':
                 inputs.push(this.renderText(default_value));
                 break;
               case 'list':
               case 'list_only':
                 inputs.push(this.renderList(default_value));
                 break;
             }
           else {
               if (this.tagsinput) this.tagsinput.tagsinput('destroy');
               inputs.push(this.renderBlock(default_block));
               inputs.push(this.renderColumn(default_value));
           }
           if (this.type == 'text' || this.type == 'list' )
             inputs.push(this.renderSwitch());
        } else {
             inputs.push(this.renderBlock(default_block));
             switch(this.type) {
               case 'column':
                 inputs.push(this.renderColumn(default_value));
                 break;
               case 'multi_column':
                 inputs.push(this.renderMultiColumn(default_value));
                 break;
             }
        }
        return inputs;

    }

    renderSwitch() {
      var ret = [];
      ret.push(<em>切换输入方式</em>);
      ret.push(<input type="checkbox" onChange={this.shiftState.bind(this)}  className="switchway" key={this.props.id + 's'}/>);
      return ret;
    }

    renderBlock(default_value) {
      if (!this.connections) return null;

      if (!default_value) default_value = 'choose';

      return (
                  <select onChange={this.selectBlock.bind(this)} key={this.id+'block'} defaultValue={default_value}>
                   <option disabled value='choose' style={{display:(default_value=='choose')?'inline':'none'}}>选择一个节点</option>
                      { this.connections.map(function (item,ind) {
                          return(
                              <option value={item.id} key={item.id}>{item.name}</option>
                          )
                      })}
                  </select>
             )
    }

/*
    configList(tags) {
      this.setState({tags:tags});
      let data = {data_type:'input', data_value:tags};
      this.config.setAttr('new_value', data);
    }
*/

    renderList(default_value) {
      let this_data_type = 'input';
      if (this_data_type == this.data_type && default_value) this.tagsinput_data = default_value;
      return <select multiple data-role='tagsinput' key={this.id+'list'} name={this_data_type} id={this.id} defaultValue=''/>
    }

    renderText(default_value) {
      let this_data_type = 'input';
      if (this_data_type != this.data_type) default_value = null;
      return (<input type="text" key={this.id+'text'} onChange={this.handleChange.bind(this)} name={this_data_type} defaultValue={default_value} />)
    }

    renderMultiColumn(default_value) {
      let this_data_type = 'multi_column';
      if (this_data_type != this.data_type) default_value = null;
      if (this.props.columns) this.state.columns = this.props.columns;
      if (this.columns) {
        this.state.columns = this.columns;
        this.columns = null;
      }
      return (
               <select multiple key={this.id+'multi_column'} onChange={this.handleChange.bind(this)} name={this_data_type} defaultValue={default_value} >
               {
                  this.state.columns.map(function(item, ind) {
                    return <option value={item} key={item}>{item}</option>
                  })
               }
               </select>
             )
    }

    renderColumn(default_value) {
      var this_data_type = 'column';
      if (this_data_type != this.data_type) default_value = null;

      if (this.props.columns) this.state.columns = this.props.columns;
      if (this.columns) {
        this.state.columns = this.columns;
        this.columns = null;
      }
      return (
               <select key={this.id+'column'}  onChange={this.handleChange.bind(this)} name={this_data_type}  defaultValue={default_value}>
               {
                  this.state.columns.map(function(item, ind) {
                    return <option value={item} key={item}>{item}</option>
                  })
               }
               </select>
             )
    }

    initDefaultValue() {
          var v = this.config.getAttr('value');
          if (v) {
            this.block = v.block;
            this.value = v.data_value;
            this.data_type = v.data_type;
          }

          v = this.config.getAttr('new_value');
          if (v) {
            if (v.block) this.block = v.block;
            this.value = v.data_value;
            this.data_type = v.data_type;
          }
    }

    render() {
        if (!this.config) {
          this.id = (this.props.id + Math.random()).replace(/\./, '');
          if (this.props.update)
            this.update = this.props.update;
          this.config = this.props.config;

          this.type = this.config.getAttr('type');
          if (this.props.connections)
            this.connections = this.props.connections
          this.initDefaultValue();
          if (this.data_type && this.data_type != 'input') {
            this.state.input_state = 1;
          }
        }
        return(<p><i>{this.config.getAttr('label')}:</i>&nbsp;&nbsp;
            {this.renderLine()}
        </p>);
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps, null, null, { withRef: true })(InputLine);
