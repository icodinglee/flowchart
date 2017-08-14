var echarts = require('echarts');
var BasePainter = require('dev/maliang/sdk/painter/base_painter')

module.exports = class extends BasePainter {
  static get name() {
    return '饼图';
  }

  static get actions() {
    return ['点击选取',]
    // return [{name:'单击选取',filter:true}]
  }

  static get requestEntity() {
    return 'VarAmountEntity';
  }

  constructor(entity_id, param, element) {
    super(entity_id, param, element);
    this.chart = echarts.init(this.element);
  }

  draw(obj) {
    var x = obj.data.x;
    var y = obj.data.y;

    var option = {
      tooltip: {
        formatter: "{b}: {c}"
      },
      series : [
          {
              label: {
                normal: {
                    position: 'inside'
                },
              },
              type: 'pie',
              selectedMode: 'multiple',
              data: x.map((val, i) => ({'name':val, 'value':y[i]})),
          }
      ]
    };

    this.chart.setOption(option);
    this.chart.on('pieselectchanged', this.actionPieSelect.bind(this));
  }

  actionPieSelect(param) {
    let selected = param.selected;
    let vals = [];
    for (let key in selected) {
      if (selected[key]) vals.push(key);
    }

    this.getFilter('data', 'x').setValueIn(vals);
 
    this.action('点击选取');
  }
};
