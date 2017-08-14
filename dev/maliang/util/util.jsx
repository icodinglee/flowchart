import 'jquery'

export function createElement(type, class_name=null, attr = {}, parent = null) {
    var el = document.createElement(type);
    if (class_name) el.className = class_name;
    if (parent) parent.appendChild(el);
    for (var key in attr)
      el.setAttribute(key, attr[key]);
    return el;
}


/*
var Util = {

/*
  Modal: class Modal {
    constructor(id = 'maliang_modal') {
      var modal = Util.createElement('div', 'modal fade', {'role':'dialog', 'data-backdrop':'static'}, document.getElementById('root'));
      modal.id = id;

      var dialog = Util.createElement('div', 'modal-dialog', {}, modal );

      var content = Util.createElement('div', 'modal-content', {}, dialog);
      var header = Util.createElement('div', 'modal-header', {}, content);
      header.style.display = 'none';
      var body = Util.createElement('div', 'modal-body row', {}, content);
      body.style.display = 'none';
      var footer = Util.createElement('div', 'modal-footer', {}, content);
      footer.style.display = 'none';

      this.id = modal.id;
      this.content = content;
      this.header = header;
      this.body = body;
      this.footer = footer;
    }

    show() {
      $('#' + this.id).modal('show');
    }

    hide() {
      $('#' + this.id).modal('hide');
    }

    add_body(el) {
      var body = this.body;

      body.appendChild(el);
      body.style.display = '';
    }

    reset() {
      var body = this.body;
      while (body.firstChild)
        body.removeChild(body.firstChild);
      body.style.display = 'none';

      var header = this.header;
      while (header.firstChild)
        header.removeChild(header.firstChild);
      header.style.display = 'none';

      var footer = this.footer;
      while (footer.firstChild)
        footer.removeChild(footer.firstChild);
      footer.style.display = 'none';
    }

    set_header(text, size = 4, close_btn = true) {
      var header = this.header;
      while (header.firstChild)
        header.removeChild(header.firstChild);

      if (close_btn) {
        var btn = Util.createElement('button', 'close', {'data-dismiss':'modal'}, header);
        btn.innerHTML = '&times;'
      }

      var title = (<div class='modal-title'><h4>'test'</h4></div>);
      $(header).append(title);
        header.style.display = '';

    }

    add_footer(el) {
      var footer = this.footer;
      footer.appendChild(el);
      footer.style.display = '';
    }
  },

  Modal: class extends React.Component {
    constructor () {
      super();
      this.state = {
        showModal: false
      };
      this.handleOpenModal = this.handleOpenModal.bind(this);
      this.handleCloseModal = this.handleCloseModal.bind(this);
    }
  
    handleOpenModal () {
      this.setState({ showModal: true });
    }
  
    handleCloseModal () {
      this.setState({ showModal: false });
    }
  
    render () {
      return (
        <div>
          <button onClick={this.handleOpenModal}>Trigger Modal</button>
          <ReactModal 
             isOpen={this.state.showModal}
             contentLabel="Minimal Modal Example"
          >
          <button onClick={this.handleCloseModal}>Close Modal</button>
          </ReactModal>
        </div>
      );
    }
  },
  RModal: class RModal extends React.Component {
    constructor () {
      super();
      this.state = {
        showModal: false
      };
      this.handleOpenModal = this.handleOpenModal.bind(this);
      this.handleCloseModal = this.handleCloseModal.bind(this);
const props = {};
ReactDOM.render(<Util.RModal {...props} />, document.getElementById('root'));
    }
  
    handleOpenModal () {
      this.setState({ showModal: true });
    }
  
    handleCloseModal () {
      this.setState({ showModal: false });
    }
  
    render () {
      return (
        <div>
          <button onClick={this.handleOpenModal}>Trigger Modal</button>
          <ReactModal 
             isOpen={this.state.showModal}
             contentLabel="Minimal Modal Example"
          >
          <button onClick={this.handleCloseModal}>Close Modal</button>
          </ReactModal>
        </div>
      );
    }
  },
foo:function () {
// ReactDOM.render((<div>oooooooooooooooooooooo</div>), document.getElementById('root'));
}

}
*/
