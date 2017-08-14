import echarts from 'echarts';
var BasePainter = require('dev/maliang/sdk/painter/base_painter.js');
// import {BMap} from '../../../../dist/js/MapApi.js';
document.write("<script type='text/javascript' src='http://api.map.baidu.com/getscript?v=2.0&ak=awiT5wRp0dNy9xP57UjlFqiqfR8D61vO&services=&t=20170803155555'></script>");
document.write("<script type='text/javascript' src='http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'></script>")
document.write("<link rel='stylesheet' href='http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css' />")
document.write("<script type='text/javascript' src='http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js'></script>")
document.write("<link rel='stylesheet' href='http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css' />")
document.write("<script type='text/javascript' src='http://api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js'></script>")
document.write("<script type='text/javascript' src='http://lbsyun.baidu.com/jsdemo/data/points-sample-data.js'></script>")


module.exports = class extends BasePainter {
  static get name() {
    return '中国地图';
  }

  static get actions() {
    return ['框选']
  }

  static get requestEntity() {
    return 'ChinaMapEntity';
  }

  draw(obj) {
      let longitudeArr=obj.data.longitude;
      let latitudeArr=obj.data.latitude;
      var map = new BMap.Map("root");
      map.enableScrollWheelZoom();//地图可放大或缩小

      // 创建点
      function addMarker(point){
          var marker = new BMap.Marker(point);
          map.addOverlay(marker);
      }
      for (var i = 0; i < latitudeArr.length; i ++) {
          var point = new BMap.Point(longitudeArr[i],latitudeArr[i]);
          addMarker(point);
      }

      //让所有的点都显示在地图中
      let pointArr=[];
      for (var i=0;i<longitudeArr.length;i++){
          pointArr.push(new BMap.Point(longitudeArr[i],latitudeArr[i]))
      }
      var v=map.getViewport(pointArr);
      map.centerAndZoom(v.center,v.zoom);//设置地图中心点和视野级别

      // 点的样式
      var options = {
          size: BMAP_POINT_SIZE_SMALL,
          shape: BMAP_POINT_SHAPE_STAR,
          color: '#d340c3',
      }
      var pointCollection = new BMap.PointCollection(pointArr, options);
      map.addOverlay(pointCollection);  // 添加Overlay


      // 矩形选择框的样式
      var styleOptions = {
          strokeColor:"#3498DB",
          fillColor:"#7F8C8D",
          strokeWeight: 3,
          strokeOpacity: 0.8,
          fillOpacity: 0.6,
          strokeStyle: 'solid'
      }

      //绘制矩形框
      var drawingManager = new BMapLib.DrawingManager(map, {
          isOpen: false,
          enableDrawingTool: true,
          drawingToolOptions: {
              anchor: BMAP_ANCHOR_TOP_RIGHT,
              offset: new BMap.Size(5, 5),
          },
          rectangleOptions: styleOptions
      });

      // 获取矩形选择框的4个点
      let self = this;
      var overlaycomplete = function(e){
          let cp1=map.getBounds();
          let sw1=cp1.getSouthWest();//矩形框的西南角
          let ne1=cp1.getNorthEast();//矩形框的东北角
          let lngLimit = self.addFilter('data', 'longitude');
          lngLimit.setValueLess(ne1.lng);
          lngLimit.setValueGreater(sw1.lng);
          let latLimit = self.addFilter('data', 'latitude');
          latLimit.setValueLess(ne1.lat);
          latLimit.setValueGreater(sw1.lat);
          self.action('框选');
          console.log(sw1)
          console.log(ne1)
      };
      drawingManager.addEventListener('overlaycomplete', overlaycomplete);



  } // end of draw
};
