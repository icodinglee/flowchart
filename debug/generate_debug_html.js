var fs = require('fs');
var debug_html_dir = './debug/html/';
var debug_html_files = (function load_html(dir) {
  var ret = []
  fs.readdirSync(dir).forEach(function(file) {
    var f = dir + '/' + file;

    if (fs.statSync(f).isDirectory()) {
      ret = ret.concat(load_html(f));
    } else if (f.substr(-5) == '.html' || f.substr(-4) == '.ejs')
      ret.push(f);
  });
  return ret;
})(debug_html_dir);
var HtmlwebpackPlugin = require('html-webpack-plugin');
var filenames = [];
var debug_html_generators = [];
for (i in debug_html_files) {
  var html_file = debug_html_files[i];
  var dist_path = html_file.substr(debug_html_dir.length);
  var l = html_file.split('/');
  var filename = l[l.length-1];

  filenames.push(filename);
  debug_html_generators.push(new HtmlwebpackPlugin({ template: html_file}));
}
debug_html_generators.push(new HtmlwebpackPlugin({ template: 'debug/debug_index.ejs', filename:'debug.html', inject:false, filenames:filenames}));

module.exports = debug_html_generators;
