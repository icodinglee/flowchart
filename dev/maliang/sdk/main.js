import request from 'dev/util/request';
import DataOption from 'dev/maliang/server/data_option';

var painter_map = {}
var painter_list = []

var req = require.context("./painter", true, /^(.*\.(js[x]*$))[^.]*$/igm);
req.keys().forEach(function(fn) {
    var key = fn;
    var painter_class = req(fn);

    if (painter_class.name != null && painter_class.name != undefined) {
      let painter_info = {name : painter_class.name,
                          actions : painter_class.actions,
                          entity : painter_class.requestEntity,
                         };
      painter_list.push(painter_info);
      painter_map[painter_class.name] = painter_class;
    }
});
painter_list.push({name:'面板'});

class Maliang {
  static get painter_list() {
    return painter_list;
  }

  constructor(host) {
    this.host = host;
    if (host.indexOf('://') < 0)
      this.host = 'http://' + host;
    else
      this.host = host;

    this.viz_painter = {};
    this.viz_element = {};
  }

  update() {
    this.render();
  }

  bind(element, id) {
    if (typeof(element) == 'string')
      element = document.getElementById(element);
    this.viz_element[id] = element;
  }

  render(viz_id_list = Object.keys(this.viz_element)) {
    if (this.render_ongoing)
      return;
    this.render_ongoing = true;

    let unloaded = [];
    for (let i in viz_id_list) {
      let viz_id = viz_id_list[i];
      if (!(viz_id in this.viz_painter))
        unloaded.push(viz_id);
    }

    let self = this;
    if (unloaded.length > 0) {
      request.ajax({url:this.host + '/vizview/api_load', method:'POST', data:{id:unloaded}, callback:function(ret, resp) {
        if (!ret) {
          alert('error');
        }
        for (let i in ret) {
          let viz_info = ret[i];
          let viz_id = viz_info.id;
          let entity_id = viz_info.entity;

          let painter_class = painter_map[viz_info.type];
          let painter = new painter_class(entity_id, viz_info.param, self.viz_element[viz_id]);
          painter.setUpdate(self.update.bind(self));
          self.viz_painter[viz_id] = painter;

        }
        self.draw(viz_id_list);
      }});
    } else self.draw(viz_id_list);
  }

  draw(viz_id_list) {
      let self = this;
      let entity_data = {};
      for (let i in viz_id_list) {
        let viz_id = viz_id_list[i];
        let painter = self.viz_painter[viz_id];
        let entity_id = painter.entity_id;
        if (!(entity_id in entity_data)) {
          entity_data[entity_id] = {};
          entity_data[entity_id].viz = [];
          entity_data[entity_id].options = new DataOption();
        }
        entity_data[entity_id].viz.push(viz_id);
        entity_data[entity_id].options.combine(painter.options);
      }

      let req = [];
      for (let entity_id in entity_data) {
        let info = entity_data[entity_id];
        req.push({entity:entity_id, options:info.options.value});
        console.log(req);
      }

      request.ajax({url:this.host + '/entityview/api_data', method:'POST', data:req, callback:function(ret, resp) {
        for (let entity_id in ret) {
          let viz_data = ret[entity_id];
          let viz_ids = entity_data[entity_id].viz;
          for (let i in viz_ids) {
            let viz_id = viz_ids[i];
            let painter = self.viz_painter[viz_id];
            painter.draw(viz_data);
          }
        }
        self.render_ongoing = false;
      }});

  }

};

module.exports = Maliang;
