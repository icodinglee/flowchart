import React from 'react';
import { connect } from 'react-redux';
import ModalConfig from 'dev/maliang/components/modalConfig';
import {PopupClass} from 'dev/maliang/components/Popup.js';

class ConfigPopup extends PopupClass {
    saveConfig(config) {
      config.renameAttr('new_value', 'value');
      if (config.is_parent) {
        var items = config.getItems();
        for (let i in items)
          this.saveConfig(items[i]);
      }
    }

    pressOk() {
      this.saveConfig(this.state.config);
      super.pressOk();
    }

    show(options) {
      this.setState({config:options.config});
      super.show(options);
    }

    renderContent() {
      return <ModalConfig config={this.state.config}/>
    }
}
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps, null, null, { withRef: true })(ConfigPopup);
