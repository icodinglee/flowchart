import array_function from 'dev/util/array_function';
import copy from 'dev/util/copy';

// 数据筛选规则，一个筛选规则定义了数据的取值范围，包括大于、大于等于、小于、小于等于、等于、包含
// 筛选规则之间是交集关系
class Filter {
  constructor() {
    this.rules = {};
  }

  setNull() {
    this.rules = null;
  }

  isNull() {
    return (this.rules == null);
  }

  getValue(operator) {
    if (!this.isNull() && (operator in this.rules))
      return this.rules[operator];
    else
      return null;
  }

  combine(filter) {
    // 筛选规则按交集合并
    if (this.isNull())
      return;
    else if (filter.isNull())
      this.setNull();
    else
      for (operator in filter.rules) {
        this.setValue(operator, filter.rules[operator]);
      }
  }

  setValue(operator, value) {
    if (this.isNull()) return;
    let rules = this.rules;
    let old_value = rules[operator];

    switch(operator) {
      case '=':
        if ('=' in rules && old_value != value) {
          this.setNull();
          return;
        } else {
          rules['='] = value;
          break;
        }
      case 'in':
        if (!old_value) rules['in'] = value;
        else rules['in'] = array_function.intersection(value, old_value);
        if (rules['in'].length == 0) {
          this.setNull();
          return;
        }
        break;
      case '<':
      case '<=':
        if (!old_value || old_value > value) rules[operator] = value;
        break;
      case '>':
      case '>=':
        if (!old_value || old_value < value) rules[operator] = value;
        break;
    }

    let equal_value = rules['='];
    let in_value = rules['in'];
    let gt_value = rules['>'];
    let ge_value = rules['>='];
    let lt_value = rules['<'];
    let le_value = rules['<='];
    if (equal_value) {
      if (in_value && !(equal_value in in_value)) this.setNull();
      else if (gt_value && equal_value <= gt_value) this.setNull();
      else if (ge_value && equal_value < ge_value) this.setNull();
      else if (lt_value && equal_value >= lt_value) this.setNull();
      else if (le_value && equal_value > le_value) this.setNull();
      else this.rules = {'=':equal_value};
      return;
    }

    if (in_value) {
      let new_value = [];
      for (let i in in_value) {
        if (gt_value && in_value[i] <= gt_value) continue;
        if (ge_value && in_value[i] < ge_value) continue;
        if (lt_value && in_value[i] >= lt_value) continue;
        if (le_value && in_value[i] > le_value) continue;
        new_value.push(in_value[i]);
      }
      if (new_value.length == 0) this.setNull();
      else this.rules = {'in':new_value};
      return;
    }

    if (gt_value >= ge_value)
      delete rules['>='];
    if (gt_value < ge_value)
      delete rules['>'];
    if (lt_value <= le_value)
      delete rules['<='];
    if (lt_value > le_value)
      delete rules['<'];

    if (gt_value >= lt_value) this.setNull();
    if (gt_value >= le_value) this.setNull();
    if (ge_value >= lt_value) this.setNull();
    if (ge_value > le_value) this.setNull();
  }
  
  setValueLessEqual(value) {
    this.setValue('<=', value);
  }

  setValueGreaterEqual(value) {
    this.setValue('>=', value);
  }
  
  setValueLess(value) {
    this.setValue('<', value);
  }

  setValueGreater(value) {
    this.setValue('>', value);
  }

  setValueEqual(value) {
    this.setValue('=', value);
  }

  setValueIn(value) {
    this.setValue('in', value);
  }
};

class Option {
  constructor() {
    // 数组中每个筛选条件为并集关系
    this.filters = [];
  }

  combine(option) {
    // 合并筛选
    if (this.filters.length == 0)
      this.filters = copy.deepcopy(option.filters);
    else if (option.filters.length > 0) {
      let filters = [];
      for (let i in this.filters) {
        for (let j in option.filters) {
          let f = copy.deepcopy(this.filters[i]);
          f.combine(option.filters[j]);
          if (!f.isNull()) filters.push(f);
        }
      }
      this.filters = filters;
    }

  }

  clearFilter() {
    this.filters = [];
  }

  getFilters() {
    return this.filters;
  }

  addFilter() {
    let f = new Filter();
    this.filters.push(f);
    return f;
  }

}

module.exports = class DataOption {
  constructor() {
    this.value = {};
  }

  combine(data_option) {
    for (let key in data_option.value) {
      let opt = this.get(key);
      opt.combine(data_option.value[key]);
    }
  }

  get(key, create=true) {
    if (!this.value[key] && create)
      this.value[key] = new Option();
    return this.value[key];
  }
};
