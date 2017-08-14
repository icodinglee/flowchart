exports.makeUrlParam = function(object) {
  var str = ''
  for (var key in object) {
    if (str != "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(object[key]);
  }
  return str;
}

exports.getUrlParam = function(key) {
  let search = window.location.search.substr(1);
  let params = {};
  if (search.length > 0) {
    let q = search.split('&');
    for (let i in q) {
      let kv = q[i].split('=');
      params[kv[0]] = decodeURIComponent(kv[1]);
    }
  }

  // var params = new URLSearchParams(window.location.search);
  if (!key) return params
  return params[key];

}

exports.ajax = function(req) {
  var url = req.url;
  var callback = req.callback;
  var request = {
    method: req.method,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  var separator = (url.indexOf("?")===-1)?"?":"&";
  if (req.data) {
     if (req.method.toLowerCase().indexOf('post') != -1)
       request.body = JSON.stringify(req.data);
     else {
       url =  url + separator + exports.makeUrlParam(req.data);
     }
  }
  var resp = null;
  fetch(url, request).then(function(response) {
    resp = response;
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return null;
    }
  }).then(function(ret) {
    callback(ret, resp);
    return;
  });
  return;
}

