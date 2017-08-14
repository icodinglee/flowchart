import BaseBlock from 'dev/maliang/components/flowchart/block/base_block';

export default class extends BaseBlock{
  static get family() {
    return "GroupBlock";
  }

  columns() {
    let keys = this.config.queryFirstItem({'usage':'augument'}).queryFirstItem({'key':'keys'}).getAttr('value').data_value;

    return keys.concat(super.columns());
  }

}
