import 'dev/maliang/components/flowchart/block/base_block.css';

import Config from 'dev/maliang/util/config';
import 'jsplumb';
import React from 'react';
import ReactDOM from 'react-dom';
import {createElement} from 'dev/maliang/util/util.jsx';


export default class BaseBlock {
  //由于子类都要super一下继承父类的构造函数，因此每次运行这里都要执行一遍这里的函数
  constructor(id, prototype, tools) {
    this.tools = tools;
    this.menu = tools.menu;
    this.config_modal = tools.config_modal;
    this.entity_func = tools.entity_func;
    this.instance = tools.instance;
    this.prototype = prototype;
    this.config = this.initConfig();
    var el = createElement('div', 'w', {}, this.instance.getContainer());
    el.id = this.id = id;
    el.block_obj = this;
    this.instance.setId(el, this.id);
    this.element = el;
  }

  fromJson(data) {
    this.initElement(data.name, data.layout, true);
    let conn_info = data.layout.connections;
    for (let i in conn_info) {
      let param = {source:conn_info[i].id, target:this.id, type:'basic'}
      if (conn_info[i].label) param.overlays = [ [ 'Label', { label:conn_info[i].label, location:0.5, id:'comment' } ] ];
      this.instance.connect(param);
    }
    for (let key in data.param) {
      let value = data.param[key];
      try {
        this.config.queryFirstItem({'usage':'param'}).queryFirstItem({'key':key}).setAttr('value', value);
      } catch(err) {}
    }
// console.log(this.config.queryFirstItem({'usage':'param'}).queryFirstItem({'key':'_sub_type'}).getAttr('value'));
    for (let section_key in data.augument) {
      let info = data.augument[section_key];
      try {
        let section = this.config.queryFirstItem({'usage':'augument', key:section_key});
        for (let key in info) {
          let value = info[key];
          section.queryFirstItem({'key':key}).setAttr('value', value);
        }
      } catch(err) {}
    }

  }

  toJson() {
    let obj = {}
    obj.id = this.id;
    obj.name = this.name;
    obj.layout = {left:this.element.style.left, top:this.element.style.top};
    let conns = this.instance.getConnections({target:this.id}, true);
    let conn_info = []
    for (let i in conns) {
      let info = {}
      info.id = conns[i].sourceId;
      var comment = conns[i].getOverlays().comment;
      if (comment) info.label = comment.label;
      conn_info.push(info);
    }
    obj.layout.connections = conn_info;

    obj.augument = {}
    obj.param = {}
    var config_items = this.config.getItems();
    for (let i in config_items) {
      let json = {}
      let section = config_items[i];
      let usage = section.getAttr('usage');
      let key = section.getAttr('key'); 
      let children = section.getChildren(['value']);
      if (children.length == 0) continue;
/*
      for (let j in section.getItems()) {
          let item = section.getItems()[j];
          json[item.getAttr('key')] = item.getAttr('value');
      }
*/
      for (let j in children) {
          let item = children[j];
          json[item.getAttr('key')] = item.getAttr('value');
      }
      if (usage == 'param') obj.param = json;
      else if (usage == 'augument') obj.augument[key] = json;
    }
    return obj;
  }

  setConfigParam(key, value) {
    return this.config.queryFirstItem({'usage':'param'}).queryFirstItem({'key':key}).setAttr('value', value);
  }

  getConfigParam(key) {
    return this.config.queryFirstItem({'usage':'param'}).queryFirstItem({'key':key}).getAttr('value');
  }

  set name(val) {
    for (let i in this.element.children) {
      if (this.element.children[i].id == 'title')
        this.element.children[i].innerHTML = this.escapeString(val);
    }
    this.block_name = val;
    this.instance.repaintEverything();
  }

  get name() {
    return this.block_name;
  }

  static get family() {
    return "BaseBlock";
  }

  get contextMenuItems() {
    return [
            {name:'配置', entry:this.showConfig},
            {name:'绑定',entry:this.bindToComponent, key:'bind_entity'},
            {name:'删除', entry:this.remove},
            {name:'重命名',entry:(function() {var val = prompt('新的名称', this.block_name); if(!val) return; this.name = val})},
           ]
  }

  bindToComponent() {
    this.entity_func(this.id, this.name);
  }

  remove() {
    this.instance.remove(this.element);
  }

  columns() {
    return this.prototype.columns;
  }

  showConfig() {
    let conns = this.instance.getConnections({target:this.id}, true);
    let connection_info = []
    for (let i in conns) {
      let source = conns[i].source.block_obj;
      connection_info.push({name:source.name, columns:source.columns(), id:source.id})
    }

    this.config.setAttr('connections', connection_info);
    let config_modal = this.config_modal.getWrappedInstance();
    config_modal.setTitle(this.name + ' ( ' + this.prototype.verbose + ' )');
    config_modal.show({config:this.config});

  }

  initConfig() {
    var block_config = new Config();
    this.configAugument(block_config);
    this.configParam(block_config);
    return block_config;
  }

  configAugument(block_config) {
    var auguments = this.prototype.augument;
    for (let i in auguments) {
      let key = auguments[i].key;
      let block = auguments[i].block;
      let aug = auguments[i].augument;
      let section = block_config.addItem({key:key, label:block, share_connections:true, usage:'augument'});
      section.addItem({key:'_block_config_share_block_', label:'选择节点', type:'block'});
      for (let j in aug) {
        let key = aug[j].key;
        let label = aug[j].label;
        let type = (aug[j].multi_column) ? 'multi_column' : 'column';
        section.addItem({key:key, label:label, type:type});
      }
    }
  }
  configParam(block_config) {
    var params = this.prototype.fields;
    if (params.length == 0) return;
    let section = block_config.addItem({key:'_block_param_', label:'参数', share_connections:false, usage:'param'});
    for (let i in params) {
      let key = params[i].key;
      let label = params[i].label;
      let type = params[i].type;
      section.addItem({key:key, label:label, type:type});
    }
  }

  contextMenu(ev) {
    ev.preventDefault();

    var menu = this.menu;
    menu.reset();
    for (let i in this.contextMenuItems) {
      let item = this.contextMenuItems[i];
      menu.addItem(item.name, item.entry.bind(this), item.args);
    }
    menu.show(ev.clientX, ev.clientY);
    return false;
  };

  escapeString(text) {
    var pre = document.createElement('pre');
    var str = document.createTextNode( text );
    pre.appendChild(str);
    return pre.innerHTML;
  }

  addEndpoint(el, pos) {
    var sourceEndpoint = {
            connectionType:"basic",
            maxConnections: -1,
/*
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            },
*/
            paintStyle: { stroke: "#7AB02C", fill: "transparent", radius: 5, },
            isSource: true,
            isTarget: true,

    }
    let uuid = this.id + pos;
    this.instance.addEndpoint( el, sourceEndpoint, { anchor:pos, uuid: uuid});
  }

  deleteEndpoint(el) {
    var endpoints = this.instance.getEndpoints(el);
    for (let i in endpoints) {
      this.instance.deleteEndpoint(endpoints[i]);
    }
  }

　//根据数据创建dom节点
  initElement(name, layout, from_json = false) {
    var el = this.element;
    el.style.left = parseInt(layout.left) + 'px';
    el.style.top = parseInt(layout.top) + 'px';
    var title = document.createElement('div');
    title.id = 'title';
    el.appendChild(title);
    this.name = name;

    this.instance.draggable(el);

    this.addEndpoint(el, "TopCenter");
    this.addEndpoint(el, "BottomCenter");
    this.addEndpoint(el, "LeftMiddle");
    this.addEndpoint(el, "RightMiddle");

    // rank=-1 允许group中的子节点获取drag&drop事件
    this.instance.makeTarget(el, {
      dropOptions: { hoverClass: "dragHover" ,rank:-1},
      paintStyle:{ fill:"rgb(198,89,30)" },
      anchor: "TopLeft",
      allowLoopback: false
    });

    // 左键右键都弹出菜单
    var self = this;
    var context_menu = this.contextMenu.bind(this);
    el.addEventListener('contextmenu', function(ev) {
      return context_menu(ev);
    }, true);
    el.addEventListener('click', function(ev) {
      if (self.mouse_x != ev.clientX || self.mouse_y != ev.clientY)
        return;
      document.removeEventListener('click', self.menu._handleClick);
      context_menu(ev);
      window.setTimeout(function() {
        document.addEventListener('click', self.menu._handleClick);
      }, 1);
    }, true);
    el.addEventListener('mousedown', function(ev) {
      self.mouse_x = ev.clientX;
      self.mouse_y = ev.clientY;
    }, true);
  }

}
