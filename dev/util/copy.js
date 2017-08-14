exports.deepcopy = function(obj) {
  var clone = obj;
  // if (typeof(obj) == 'array') { wrong
  if (!obj) {
    ;
  } else if (obj instanceof Array) {
    clone = [];
    for (let i = 0; i < obj.length; i++)
      clone.push(exports.deepcopy(obj[i]));
  } else if (typeof(obj) == 'object') {
    clone =  Object.create(Object.getPrototypeOf(obj));
    for (let key in obj) {
      clone[key] = exports.deepcopy(obj[key]);
    }
  }
  return clone;
}

