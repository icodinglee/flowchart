import Options from 'dev/maliang/server/data_option'

module.exports = class BasePainter {
  static get name() {
    return null;
  }

  static get actions() {
    return [];
  }

  static get requestEntity() {
    return null;
  }

  getOption(data, key) {
    return this.options.get(data + ',,,' + key);
  }

  getFilter(data, key) {
    let filters =  this.getOption(data, key).getFilters();
    if (filters.length == 0)
      return this.addFilter(data, key);
    else
      return filters[0];
  }

  addFilter(data, key) {
    return this.getOption(data, key).addFilter();
  }

  clearFilter(data, key) {
    this.getOption(data, key).clearFilter();
  }

  constructor(entity_id, param, element) {
    this.entity_id = entity_id;
    this.param = param;
    this.element = element;
    this.options = new Options();
  }

  setPanelShift(viz_id, index) {

  }

  action(name) {
    this.update();
  }

  setUpdate(func) {
    this.update = func;
  }

  draw(data) {
    return;
  }
}
