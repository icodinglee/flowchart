import request from 'dev/util/request';

exports.flowchart_create_node = function(signature, board, n, callback) {
  request.ajax({url:'/blockview/api_create', method:'POST', data:{signature:signature, board:board, num:n}, callback});
}

exports.blockboard_list_all = function(callback) {
  request.ajax({url:'/blockboardview/api_list_all', method:'GET', callback});
}

exports.entity_list_all = function(board, callback) {
  request.ajax({url:'/entityview/api_list_all', method:'GET', 'data':{board:board}, callback:callback});
}

exports.block_types = function(callback) {
  request.ajax({url:'/blockview/api_block_types', method:'GET', callback:callback});
}

exports.blockboard_save = function(req, callback) {
  request.ajax({url:'/blockboardview/api_save', method:'POST', 'data':req, callback:callback});
}

exports.blockboard_load = function(board_id, callback) {
  request.ajax({url:'/blockboardview/api_load/' + board_id, method:'GET', callback:callback});
}

exports.entity_types = function(callback) {
  request.ajax({url:'/entityview/api_entity_types', method:'GET', callback:callback});
}

exports.flowchart_create_entity = function(signature, board, callback) {
  request.ajax({url:'/entityview/api_create', method:'POST', data:{signature:signature, board:board}, callback});
}

exports.viz_save = function(id, name, type, entity, param, callback) {
  request.ajax({url:'/vizview/api_save', method:'POST', data:{id:id, name:name, type:type, entity:entity, param:param}, callback});
}

exports.viz_load = function(id, callback) {
  request.ajax({url:'/vizview/api_load', method:'POST', data:{id:id}, callback:callback});
}

