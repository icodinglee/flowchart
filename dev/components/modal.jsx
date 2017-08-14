import ReactModal from 'react-modal';
import React from 'react';

// add zIndex to props
class Modal extends React.Component {
  render() {
    let props = {};
    if (this.props.zIndex)
      props = {style:{overlay:{zIndex:this.props.zIndex}}};
    Object.assign(props, this.props);

    return <ReactModal {...props} />
  }

};
export default Modal;
