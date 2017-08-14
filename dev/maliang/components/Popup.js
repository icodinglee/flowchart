import React from 'react';
import { connect } from 'react-redux';
class Popup extends React.Component{
    constructor(){
        super();
        this.state={
            popuphide:true,
            title:null,
        };
        this.pressCancel=this.pressCancel.bind(this);
        this.pressOk=this.pressOk.bind(this);
    }

    renderTitle(title) {
      if (!this.state.title) return null;
      return <h4>{this.state.title}</h4>
    }

    setTitle(title) {
      this.setState({title:title});
    }

    pressOk() {
      this.pressCancel();
    }

    show(options) {
      if (!options) options = {}
      if ('title' in options) this.setTitle(options.title);
      this.setState({popuphide:false});
    }

    pressCancel(){
        this.setState({
            popuphide:true
        })
    }
    renderContent() {
      return null;
    }

    renderFooter() {
      return (
                <div>
                    <button onClick={this.pressOk} className='set'>确定</button>
                    <button onClick={this.pressCancel} className='cancle'>取消</button>
                </div>
      )
    }
    render() {
        if (this.state.popuphide) return null;
        return (
            <div className="bigpopup" >
            <div className="smallAlert">
                {this.renderTitle()}
                <ul>
                    <li>
                        {this.renderContent()}
                    </li>
                </ul>
                {this.renderFooter()}
            </div>
        </div>
        )
    }
}
export {Popup as PopupClass};
function mapStateToProps(state) {
    return state
};
export default connect(mapStateToProps, null, null, { withRef: true })(Popup);
