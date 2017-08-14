import BaseBlock from 'dev/maliang/components/flowchart/block/base_block';

export default class extends BaseBlock{
  static get family() {
    return "DataElementBlock";
  }


  columns() {
    try {
      return this.config.queryFirstItem({'usage':'param'}).queryFirstItem({'key':'_output_columns'}).getAttr('value').data_value;
    } catch(err) {};
    return [];
  }

}
