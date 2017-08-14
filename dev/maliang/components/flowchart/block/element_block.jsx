import BaseBlock from 'dev/maliang/components/flowchart/block/base_block';

export default class extends BaseBlock{
  static get family() {
    return "ElementBlock";
  }

  toJson() {
    let json = super.toJson();
    json.layout.prototype = this.prototype;
    return json;
  }

  fromJson(json) {
    Object.assign(this.prototype, json.layout.prototype);
    this.prototype.verbose = this.prototype.name;
    this.config = this.initConfig();
    super.fromJson(json);
  }

}
