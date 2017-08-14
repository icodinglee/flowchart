import request from 'dev/util/request';
import 'dev/maliang/components/flowchart/block/composite_block.css';
import {getBlockClass} from 'dev/maliang/components/flowchart/main.jsx';
import Api from 'dev/maliang/server/api';
import BaseBlock from 'dev/maliang/components/flowchart/block/base_block';

export default class extends BaseBlock{
  static get family() {
    return "CompositeBlock";
  }

  constructor(id, prototype, tools) {
    super(id, prototype, tools);
    this.children_info = this.prototype.children;
    this.children_type = this.prototype.children_class;

  }

  get members() {
    var members = this.instance.getGroup(this.id).getMembers();
    var ret =[];
    for (let i in members) {
      if (this.element.contains(members[i]))
        ret.push(members[i]);
    }
    return ret;
  }

  fromJson(json) {
    super.fromJson(json);
    var members = json.layout.members;
    for (let i in members) {
      let child_el = document.getElementById(members[i]);
      this.initChild(child_el.block_obj);
    }
  }

  toJson() {
    var json = super.toJson();
    var members = this.members;
    json.layout.members = [];
    for (let i in members) {
        json.layout.members.push(members[i].id);
    }
    return json;
  }

  newChild(i) {
    var children_info = (i) ? [this.children_info[i]] : this.children_info;
    var num = children_info.length;
    let self = this;
    Api.flowchart_create_node(this.children_type, request.getUrlParam('board'), num, function(ret_data, response) {
      if (!ret_data) return;
      for (let j in ret_data.id) {
        let child_id = ret_data.id[j];
        let child_info = children_info[j]

        let children_num = self.members.length;
        let left = parseInt(self.element.style.left) + 50 * children_num + 20;
        let top = parseInt(self.element.style.top) + 40;//+ 9 * self.nodes.length + 40;
        Object.assign(ret_data, child_info);
        var child_class = getBlockClass(ret_data);
        let node = new child_class(child_id, ret_data, self.tools);
        node.initElement(child_info.name, {left:left, top:top});
        node.setConfigParam('_sub_type', node.prototype.sub_type);
        node.setConfigParam('_parent', {data_type:'block', block:self.id});
        self.initChild(node);
      }
    });
  }

  initChild(node) {
    if (this.prototype.children_rigid)
      node.remove = ()=>{};
    this.instance.addToGroup(this.id, node.element);
  }

  get contextMenuItems() {
    let items = super.contextMenuItems;
    for (let i in items) {
      if (items[i].key == 'bind_component') {
        items.splice(i, 1);
        break;
      }
    }

    // 子节点形态固定
    if (this.prototype.children_rigid)
      return items;

    let children_info = this.prototype.children;
    for (let i in children_info) {
      items.splice(i+1, 0, {name:'添加' + children_info[i].name, entry:this.newChild, args:[i]});
    }
    return items;
  }

  initElement(name, layout, from_json = false) {
    super.initElement(name, layout, from_json);
    var el = this.element;
    el.className = "group-container";
    el.setAttribute('group', this.id);

    for (let i in el.children) {
      if (el.children[i].id == 'title')
        el.children[i].className = 'title';
    }

    var block_id = this.id;
    this.group = this.instance.addGroup({
        el:el,
        id:block_id,
        constrain:true,
        anchor:"Continuous",
        endpoint:"Blank",
        droppable:false
    });
    this.deleteEndpoint(el);

    if (from_json) {
    } else if (this.prototype.children_rigid) {
      this.newChild();
    }

    return el;
  }
}
