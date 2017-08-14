import React from 'react';
import { connect } from 'react-redux';
import Input from 'dev/maliang/components/input';

class SelectConfig extends React.Component{
    constructor(){
        super();
        this.state = {columns:[]};
    }

    updateColumn(columns) {
          this.setState({columns:columns});
    }

    componentDidMount() {
    }

    parseConfig(config, share_connection = false) {
      let label = config.getAttr('label')
      let items = config.getItems();
      let is_parent = config.is_parent;
      var key = config.getAttr('key');
      if (!key && !is_parent) return null;

      if (key && is_parent) {
        let all = config.getChildren(['type']);
        let predefined = config.queryChildren({type:'predefined'});
        if (all.length == predefined.length) return null;
      }

      var self = this;
      if (key && is_parent)
         return (<div key={key}><h5>{label}</h5>
                 {items.map(function(item, index) {
                     if (item.getAttr('type') == 'block')
                       share_connection = true;
                     return self.parseConfig(item, share_connection);
                  }) }
                 </div>
                )
      else if (is_parent)
         return (<div>
                 {items.map(function(item, index) {
                     if (item.getAttr('type') == 'block')
                       share_connection = true;
                     return self.parseConfig(item, share_connection);
                 })}
                 </div>
                )
      else if (config.getAttr('type') == 'predefined') return null;

      var key = config.getAttr('key');
      // 单行输入
      if (config.getAttr('type') == 'block') {
        return <Input id={key} key={key} config={config} connections={self.connections} update={self.updateColumn.bind(self)} />
      }

      if (share_connection) {
        return <Input id={key} key={key} config={config} columns={this.state.columns}  />
      } else
        return <Input id={key} key={key} config={config} connections={self.connections}  />

    }

    render(){
        if (!this.props.config) return null;
        this.connections = this.props.config.getAttr('connections');
        return this.parseConfig(this.props.config);
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps)(SelectConfig);
