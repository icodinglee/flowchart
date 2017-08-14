import React from 'react';
import 'dev/maliang/components/contextMenu.css';
import ReactDOM from 'react-dom';

export default class ContextMenu extends React.Component {
    state = {
        visible: false,
        valid: true,
    };

    componentDidMount() {
        // document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        // document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
      // document.removeEventListener('contextmenu', this._handleContextMenu);
      document.removeEventListener('click', this._handleClick);
      // document.removeEventListener('scroll', this._handleScroll);
    }

    enable() {
      this.setState({valid:true})
    }

    disable() {
      this.setState({valid:false})
    }

    show(x, y) {
        if (this.root.children.length == 0)
          return;

        if (!this.state.valid) return;

        this.setState({ visible: true });

        const clickX = x;
        const clickY = y;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            this.root.style.left = `${clickX + 5}px`;
        }

        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }

    }

    _handleContextMenu = (event) => {
        event.preventDefault();
        show(event.clientX, event.clientY);
    };

    _handleClick = (event) => {
        this.setState({ visible: false, });
        return;

        const { visible } = this.state;
        const target = event.target;
        const wasOutside = (target != this.root && !this.root.contains(target));
        if (wasOutside && visible) this.setState({ visible: false, });
    };

    _handleScroll = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false, });
    };

    reset() {
     while (this.root.firstChild)
        this.root.removeChild(this.root.firstChild);

    }

    addItem(text, func, arglist) {
        var d = document.createElement('div');
        d.className = 'contextMenu--option';
        d.innerHTML = text;

        d.onclick = function() {
          func.apply(null, arglist);
        }
        this.root.appendChild(d);
    };

    render() {
        const { visible } = this.state;

        return <div ref={ref => {this.root = ref}} style={{display: visible ? 'block' : 'none' }} className="contextMenu">
                <div className="contextMenu--option">Visit official site</div>
                <div className="contextMenu--option contextMenu--option__disabled">View full version</div>
                <div className="contextMenu--option">Settings</div>
                <div className="contextMenu--separator" />
                <div className="contextMenu--option">About this app</div>
            </div>
    };
}
