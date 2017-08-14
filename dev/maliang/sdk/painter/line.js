var echarts = require('echarts');
var BasePainter = require('dev/maliang/sdk/painter/base_painter')

module.exports = class extends BasePainter {
  static get name() {
    return '折线图';
  }

  static get actions() {
    return ['点击选取','框选']
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

    if (!this.chart) this.chart = echarts.init(this.element);
    var option = {
        //鼠标移上去提示信息
        tooltip: {
            formatter: '{b} : {c}',
            trigger: 'item',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        //右上角工具条
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                brush: {type: ['lineX','lineY','rect','keep','clear']},//框选
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        brush: {
            throttleType: 'debounce',
            throttleDelay: 300,
            brushLink: 'all', //不同系列间，选中的项可以联动,all允许所有数据联动
            outOfBrush: {
                colorAlpha: 1
            },
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : x
            }
        ],
        yAxis : [
            {
                type : 'value',
            }
        ],
        series : [
            {
                type:'line',
                itemStyle:{normal:{label:{show: true, position: 'top'}}},
                data: y,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            
        ]
    }

    this.chart.setOption(option);

    this.chart.on('brushSelected', this.actionLineBrush.bind(this));

  }; //the end of draw

    //框选
    actionLineBrush(params) {
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
    } // the end of actionScatterBrush


}; //the end of BasePainter
