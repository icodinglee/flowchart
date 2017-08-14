import {deepcopy} from 'dev/util/copy'

export default class Config {
  constructor(attrs) {
    this.data = {};
    this.children = [];
    for (let key in attrs)
      this.setAttr(key, attrs[key]);
  }

  empty() {
    return (Object.keys(this.data).length == 0 && this.children.length == 0);
  }

  renameAttr(from, to) {
    if (from in this.data) {
      this.data[to] = this.data[from];
      delete this.data[from];
    }
  }

  hasAttr(key) {
    return (key in this.data);
  }

  setAttr(key, value) {
    this.data[key] = value;
  }

  getAttr(key) {
    return this.data[key];
  }

  getAttrs() {
    return this.data;
  }

  pop() {
    if (this.children.length == 0) return null;
    let ind = this.children.length - 1;
    let ret = this.children[ind];
    this.children.splice(ind, 1);
    return ret;
  }

  getChildren(attr_keys) {
    if (!attr_keys)
      return this.children;
    let ret = [];
    let children = this.children;
    for (let i in children) {
      let ok = true;
      for (let j in attr_keys) {
        if (!children[i].hasAttr(attr_keys[j])) {
          ok = false;
          break;
        }
      }
      if (ok) ret.push(deepcopy(children[i]));
    }
    return ret;
  }

  getItems(attr_keys) {
    return this.getChildren(attr_keys);
  }

  addChild(attrs) {
    this.is_parent = true;
    var config = new Config(attrs);
    this.children.push(config);
    return config;
  }

  addItem(attrs) {
    return this.addChild(attrs);
  }

  queryChildren(attrs) {
    var ret = []
    for (let i in this.children) {
      let item = this.children[i];
      let check_ok = true;
      for (let key in attrs) {
        if (!item.hasAttr(key) || item.getAttr(key) != attrs[key]) {
          check_ok = false;
          break;
        }
      }
      if (check_ok) ret.push(item);
    }
    return ret;
  }
  queryItems(attrs) {
    return this.queryChildren(attrs);
  }

  queryFirstChild(attrs, create = true) {
    var c = this.queryItems(attrs);
    if (c.length > 0) return c[0];
    if (create)
      return this.addChild(attrs);
    else return null;
  }

  queryFirstItem(attrs) {
    return this.queryFirstChild(attrs);
  }


}

