import request from 'dev/util/request';
import React from 'react';
import Config from 'dev/maliang/util/config';
import ReactDOM from 'react-dom';
import Api from 'dev/maliang/server/api';
import 'jquery-simulate-ext/libs/jquery.simulate'
import 'jsplumb';
import 'dev/maliang/components/flowchart/css/jsplumbtoolkit-defaults.css';
import 'dev/maliang/components/flowchart/css/jsplumbtoolkit-demo.css';
import Modal from 'dev/components/modal'
// import ConfigModal from 'dev/maliang/components/configModal';


var block_map = {}
var req = require.context("./block", true, /^(.*\.(js[x]$))[^.]*$/igm);
//获取所有的类型，把其保存在一个对象中，在后面进行判断，确定要加载的对象
req.keys().forEach(function(fn) {
    var block_class = req(fn).default;
    var family = block_class.family;
    block_map[family] = block_class;
});

export default class Flowchart extends React.Component{
  static set_ready() {
    Flowchart.jsplumb_ready = true;

  }

  constructor() {
    super();
    this.entity_list = [];
    this.entity_types = {};
    this.board = request.getUrlParam('board');
    let self = this;
    Api.entity_types(function(data, resp) {
      for (let i in data) {
        let signature = data[i].signature;
        self.entity_types[signature] = data[i];
      }
    });
  }

  waitToLoad() {
    var self = this;
    window.setTimeout(function() {
      if (!self.instance)
        window.setTimeout(function() {
          self.waitToLoad();
        })
      else
        self.load_all();
    }, 23);
  }

  componentDidMount() {
    this.waitToLoad();
  }

  load_all() {
    var self = this;
    Api.blockboard_load(this.board, function(data, resp) {
      let objs = []
      for (let i in data.blocks) {
        let load_data = data.blocks[i];
        let id = load_data.id;
        let block_prototype = load_data.prototype;
        let block_class = Flowchart.getClass(block_prototype);
        var block_obj = new block_class(id, block_prototype, {instance:self.instance, config_modal:self.props.config_modal, menu:self.props.menu, entity_func:self.bindToEntityPopup.bind(self)});
        objs.push(block_obj);

        // var block_obj = new block_map[family]({id:block_data.id[0], instance:instance, prototype:block_data, refs:self.refs});
        // block_obj.init(name, {left:left-rect.left, top:top-rect.top});
      }
      for (let i in data.blocks) {
        objs[i].fromJson(data.blocks[i]);

        //由于jsplumb的一个bug需要下面三行代码刷新端点位置
        self.props.menu.disable();
        $(objs[i].element).simulate('drag');
        self.props.menu.enable();
      }
      self.instance.repaintEverything();
      for (let i in data.entities) {
        let entity_data = data.entities[i];
        let entity = self.renderEntity({id:entity_data.id, name:entity_data.name, signature:entity_data.signature});
        let entity_config = self.getEntityConfig(entity);

        for (let section_key in entity_data.connection) {
          let info = entity_data.connection[section_key];
          try {
            let section = entity_config.queryFirstItem({key:section_key});
            for (let key in info) {
              let value = info[key];
              section.queryFirstItem({'key':key}).setAttr('value', value);
            }
          } catch(err) {}
        }

      }

      let block_id = request.getUrlParam('block');
      if (block_id) {
        let block = self.getBlock(block_id);
        block.showConfig();
      } else {
        let entity_id = request.getUrlParam('entity');
        if (entity_id) {
          let ind = self.getEntityIndex(entity_id);
          let entity = self.entity_list[ind];
          self.editEntityPopup(entity);
        }
      }

    });
        // block_obj.fromJson(data);
  }

  renderEntity(param, ind) {
        let entity = this.renderMaliangEntity(param);
        if (!ind)
          this.entity_list.push(entity);
        else
          this.entity_list[ind] = entity;
        this.props.maliang_entity_func(this.entity_list);
        return entity;
  }

  get container() {
    return ReactDOM.findDOMNode(this);
  }

  //创建实例, 把流程图上的核心配置项都放在这里，便于后面的函数进行调用
  get instance() {
    if (Flowchart.jsplumb_ready && !this.jsplumb) {
      //根据数据执行jsplump内置函数,进行绘制
      this.jsplumb = window.flowchart = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 5, paintStyle: { stroke: "#7AB02C",  radius: 50, }}],
        Connector:"StateMachine",
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            // [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
        ],
        Container: this.container
      });
      this.jsplumb.registerConnectionType("basic", { anchor:"Continuous",
                                                     detachable:false,
                                                     connector:"StateMachine",
                                                     hoverPaintStyle: { strokeWidth:9, },
                                                     paintStyle:{
                                                        stroke:"rgba(198,89,30,0.7)",
                                                        strokeStyle:'blue' ,
                                                        strokeWidth:1
                                                     },
                                                   });

      var self = this;
      // 组内节点不能往所在组连接, 两个组件最多只能一个连接，不能双向连接
      this.jsplumb.bind('beforeDrop', function(connection) {
        var source_id = connection.sourceId;
        var target_id = connection.targetId;

        try {
            var source_group = self.jsplumb.getGroupFor(source_id);
            if (source_group && source_group == self.jsplumb.getGroupFor(target_id)) {
              return false;
            }
        } catch (err) {}
        try {
            if (self.jsplumb.getGroupFor(source_id) == self.jsplumb.getGroup(target_id)) {
              return false;
            }
        } catch (err) {}

        if (self.jsplumb.select({source:source_id,target:target_id}).length > 0)
           return false;
        if (self.jsplumb.select({source:target_id,target:source_id}).length > 0)
           return false;
        return true;
      });

      var context_menu = function(conn, ev) {
          if (conn.sourceId) { // 边
            ev.preventDefault();
            var menu = self.props.menu;
            document.removeEventListener('click', menu._handleClick);
            menu.reset();
            menu.addItem('取消连接', function() {self.jsplumb.deleteConnection(conn);});
            menu.addItem('注释', function() {
                                var old = conn.getOverlays().comment;
                                if (old) old = old.label;

                                var val = prompt(undefined, old);
                                  if (val != null) {
                                    conn.removeOverlay('comment');
                                    if (val.length > 0)
                                      conn.addOverlay(["Label", { label: val, location:0.5, id:'comment'} ]);
                                  }
                                }
                        );
            menu.show(ev.clientX, ev.clientY);
            window.setTimeout(function() {
              document.addEventListener('click', menu._handleClick);
            }, 1);

            return false;
          }
      }
      this.jsplumb.bind("connection", function (info, originalEvent) {
          info.sourceEndpoint.setStyle({ fill:"rgb(198,89,30)"});
          info.targetEndpoint.setStyle({ fill:"rgb(198,89,30)"});
      });

      this.jsplumb.bind("click", function (connection, originalEvent) {
          return context_menu(connection, originalEvent);
      });

      this.jsplumb.bind("contextmenu", function(info, originalEvent) {
          // todo :需要检测配置项依赖
          return context_menu(info, originalEvent);
      });
    }
    // 这里返回了绘制流程图所需的所有方法
    return this.jsplumb;
  }

  save() {
    var blocks = [];
    let children = this.container.querySelectorAll('*');
    for (let i in children) {
      let block_obj = children[i].block_obj;
      if (block_obj)
        blocks.push(block_obj.toJson());
    }

    var entities = [];
    for (let i in this.entity_list) {
      let comp = this.entity_list[i];
      let conns = {};

      let entity_config = this.getEntityConfig(comp);
      for (let i in entity_config.getItems()) {
        let json = {}

        let section = entity_config.getItems()[i];
        let section_key = section.getAttr('key');
        let children = section.getChildren(['value']);
        if (children.length == 0) continue;
        for (let j in children) {
          let item = children[j];
          json[item.getAttr('key')] = item.getAttr('value');
        }
        conns[section_key] = json;
      }

      entities.push({id:comp.key, name:comp.props.name, connection:conns});
    }

    Api.blockboard_save({board:this.board, blocks:blocks, entities:entities}, function(data, response) {
      if (data && data.result == 'ok')
        alert('已保存');
      else
        alert('错误');
    });

  }

  static getClass(block_prototype) {
    let block_family = block_prototype.family;
    for (let i in block_family) {
      let family = block_family[i];
      if (family in block_map) {
        return block_map[family];
      }
    }
  }

  getBlock(block_id) {
    let children = this.container.querySelectorAll('*');
    for (let i in children) {
      let block_obj = children[i].block_obj;
      if (block_obj && block_obj.id == block_id)
        return block_obj;
    }
  }

  getEntityConfig(entity) {
    let entity_config = entity.props.config;
    if (entity_config.empty()) {
      if (Object.keys(this.entity_types).length == 0) return;
      let entity_info = this.entity_types[entity.props.signature];
      let prototype = entity_info.prototype;
      for (let i in prototype) {
        let section_key = prototype[i].key;
        let section_label = prototype[i].label;
        let section_data = prototype[i].data;

        let section = entity_config.addItem({key:section_key, label:section_label});
        for (let j in section_data) {
          let key = section_data[j].key;
          let label = section_data[j].label;
          let required = section_data[j].required;
          let type = (section_data[j].multi_column) ? 'multi_column' : 'column';
          section.addItem({key:key, label:label, type:type, required:required});
        }
      }
    }
    return entity_config;
  }
 
  editEntityPopup(obj, connected = []) {
    let entity_config = this.getEntityConfig(obj);
    for (let i in entity_config.getItems()) {
      let section = entity_config.getItems()[i];
      for (let j in section.getItems()) {
        let children = section.getChildren(['value']);
        for (let j in children) {
          let block_id = children[j].getAttr('value').block;
          if (block_id && ! (block_id in connected))
            connected.push(block_id);
        }
      }
    }

    let conns = []
    for (let i in connected) {
      let block_obj = this.getBlockObj(connected[i]);
      conns.push({id:block_obj.id, name:block_obj.name, columns:block_obj.columns()});
    }
    entity_config.setAttr('connections', conns);

    let signature = obj.props.signature;
    let verbose = this.entity_types[signature].verbose;

    this.props.config_modal.getWrappedInstance().setTitle(obj.props.name + ' ( ' + verbose + ' )');
    this.props.config_modal.getWrappedInstance().show({config:entity_config});
  }

  getBlockObj(block_id) {
    let children = this.container.querySelectorAll('*');
    for (let i in children) {
      if (children[i].id == block_id && children[i].block_obj)
        return children[i].block_obj;
    }
  }

  bindToEntityPopup(block_id, block_name) {
    this.props.add_entity_modal.getWrappedInstance().show({entity_types:this.entity_types, block_id:block_id, block_name:block_name, return_func:this.setEntity.bind(this), entity_list:this.entity_list});
  }

  getEntityIndex(id) {
    for (let i in this.entity_list) {
      if (this.entity_list[i].key == id) {
        return i;
      }
    }
  }
  entityMenu(event) {
    event.preventDefault();
    let self = this;
    let entity_id = event.target.id;
    var menu = self.props.menu;
    document.removeEventListener('click', menu._handleClick);
    menu.reset();
    menu.addItem('配置', function() { 
                                       let ind = self.getEntityIndex(entity_id);
                                       let entity_obj = self.entity_list[ind];
                                       self.editEntityPopup(entity_obj);
                                    });
    menu.addItem('重命名', function() { 
                                       let ind = self.getEntityIndex(entity_id);
                                       let old_name = self.entity_list[ind].props.name;
                                       let signature = self.entity_list[ind].props.signature;
                                       let new_name = prompt(undefined, old_name);
                                       if (new_name) {
                                         self.renderEntity({id:entity_id, name:new_name, signature:signature}, ind);
                                       }
                                      });
    menu.addItem( '删除', function() {
                                      let ind = self.getEntityIndex(entity_id);
                                      self.entity_list.splice(ind, 1);
                                      self.props.maliang_entity_func(self.entity_list);
                                   })
    menu.show(event.clientX, event.clientY);
    window.setTimeout(function() {
        document.addEventListener('click', menu._handleClick);
    }, 1);
  }

  renderMaliangEntity(param) {
        let id = param.id;
        let name = param.name;
        let signature = param.signature;
        return <button key={id} id={id} onClick={this.entityMenu.bind(this)} onContextMenu={this.entityMenu.bind(this)} name={name} config={new Config()} signature={signature} >{name}</button>;
  }

  setEntity(block_id, create_new, param) {
    if (create_new) {
      let signature = param.type;
      let name = param.name;
      let board = this.board;
      let entity_func = this.props.maliang_entity_func;
      let self = this;
      Api.flowchart_create_entity(signature, board, function(data, resp) {
        let entity = self.renderEntity({id:data.id, name:name, signature:signature});
        let block_obj = self.getBlockObj(block_id);
        // let info = {id:block_id, name:block_obj.name, columns:block_obj.columns()};
        self.editEntityPopup(entity, [block_id]);
      });
    } else {
      let ind = this.getEntityIndex(param.id);
      this.editEntityPopup(this.entity_list[ind], [block_id]);
    }
  }

  //通过树状图获取id及其数据， new block(data)
  createNode(info) {
    var instance = this.instance;
    if (!instance) return;

    var self = this;
    Api.flowchart_create_node(info.signature, this.board, 1, function(block_data, response) {
      if (!block_data) {alert(JSON.stringify(response)); return;}
      let block_class = Flowchart.getClass(block_data);

      var rect = self.instance.getContainer().getBoundingClientRect();
      var block_obj = new block_class(block_data.id[0], block_data, { instance:instance, config_modal:self.props.config_modal, menu:self.props.menu, entity_func:self.bindToEntityPopup.bind(self)});
      block_obj.initElement(info.name, {left:info.left-rect.left, top:info.top-rect.top});
    });

  }

  render() {
    return (<div className=' jtk-demo-canvas canvas-wide statemachine-demo jtk-surface jtk-surface-nopan'>
            </div>);
  }
}
var getBlockClass = Flowchart.getClass;
export {getBlockClass};

jsPlumb.ready = Flowchart.set_ready();
