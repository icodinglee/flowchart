var echarts = require('echarts');
var BasePainter = require('dev/maliang/sdk/painter/base_painter.js');

module.exports = class extends BasePainter {
  static get name() {
    return '柱状图';
  }

  static get actions() {
    return ['单击选择','框选']
  }

  static get requestEntity() {
    return 'VarAmountEntity';
  }

  constructor(entity_id, param, element) {
    super(entity_id, param, element);
    this.chart = echarts.init(this.element);
  }

  draw(obj) {
    var obj = obj;
    var x = obj.data.x;
    var y = obj.data.y;
    this.xVal = x; //把x值存起来
    this.yVal = y;

    var option = {
            title: {
                text: ''
            },
            tooltip: {},
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                    brush: {type: ['lineX','lineY','rect','keep','clear']},//框选
                    restore: {}
                }
            },
            brush: {
                throttleType: 'debounce',
                throttleDelay: 300,
                outOfBrush: {
                    colorAlpha: 1
                },
            },
            xAxis: {
                data: x
            },
            yAxis: {},
            series: [{
                type: 'bar',
                data: y
            }]
        };

    this.chart.setOption(option);

    this.chart.on('brushSelected', this.actionHistBrush.bind(this));

  } // end of draw

    //框选
    actionHistBrush(params) {
        var brushComponent = params.batch[0];

        let selected = brushComponent.selected;//框选的集合项

        let selectVals = []; //存放框选值

        for (var sIdx = 0; sIdx < selected.length; sIdx++) {
            // 对于每个 series：
            var dataIndices = selected[sIdx].dataIndex;

            for (var i = 0, len = dataIndices.length; i < len; i++) {
                var dataIndex = dataIndices[i];
                selectVals.push(this.xVal[dataIndex]); // 把选值的x值存起来
            }
        }

        if (selectVals.length == 0) return;
        
        this.getFilter('data', 'x').setValueIn(selectVals); //筛选框选值实现联动
 
        this.action('框选'); 
    }

};
