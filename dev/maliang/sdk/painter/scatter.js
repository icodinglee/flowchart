var echarts = require('echarts');
var BasePainter = require('dev/maliang/sdk/painter/base_painter')

module.exports = class extends BasePainter {
  static get name() {
    return '散点图';
  }

  static get action_list() {
    return ['点击选取','框选']
  }

  static get requestEntity() {
    return 'VarAmountEntity';
  }

  draw(obj) {
    var obj = obj;
    var x = obj.data.x;
    var y = obj.data.y;
    console.log(obj);
    this.xVal = x;
    this.yVal = y;

    if (!this.chart) this.chart = echarts.init(this.element);
    var option = {
        //鼠标移上去提示信息
        tooltip: {
            formatter: '{b}',
            trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
        },
        xAxis: {
            type: 'category',
            data: x,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
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
            outOfBrush: {
                colorAlpha: 1
            },
        },
        calculable : true,
        series: [{
            name: '',
            type: 'scatter',
            symbolSize: 12,
            label: {
                emphasis: {
                    show: true,
                    formatter: function(param) {
                        return param.data[3];
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(25, 100, 150, 0.5)',
                    shadowOffsetY: 5,
                    color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                        offset: 0,
                        color: 'rgb(129, 227, 238)'
                    }, {
                        offset: 1,
                        color: 'rgb(25, 183, 207)'
                    }])
                }
            },
            data: this.xVal
        }]
    }

    this.chart.setOption(option);

    //点击

    this.chart.on('click', function (param) {
        console.log({name: param.name, data: param.data})  //点击的数据
    });

    //框选

    this.chart.on('brushSelected', this.actionScatterBrush.bind(this));

  }; //the end of draw

  //框选
    actionScatterBrush(params) {
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
