var api_server = 'http://192.168.2.126/';

var fs = require('fs');
if (!fs.existsSync('.code_root/dev')) fs.symlinkSync('../dev', '.code_root/dev', 'junction');

var path = require('path');
var webpack = require('webpack');
var debug = process.env.NODE_ENV !== "production";
module.exports = {
  entry: { //配置入口文件，有几个写几个
    flowchart: 'dev/maliang/entry/flowChartEntry.js',
    maliang: 'dev/maliang/sdk/main.js',
    dashboard:'dev/maliang/entry/dashboardEntry.js'
  },

  output: { 
    path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    publicPath: '/dist/',       //模板、样式、脚本、图片等资源对应的server上的路径
    filename: 'js/[name].js',     //每个页面对应的主js的生成配置
    library: '[name]',
    libraryTarget: 'umd',
    chunkFilename: 'js/[id].chunk.js',   //chunk生成的配置
  },
  devServer:{
    disableHostCheck :true,
    historyApiFallback:true,
    port:8008,
    host:'0.0.0.0',

    hot:true,
    inline:true,
    proxy: {
        '@(/*/api_*/*)': {
          target: api_server,
          changeOrigin: true
        },
        '@(/*/api_*)': {
          target: api_server,
          changeOrigin: true
        },
        '@(/login/*)': {
          target: api_server,
          changeOrigin: true
        },
    }
  },
/*
 externals: {
     'react': 'React',
     'echart': 'echart'
  },
*/
    devtool: debug ? 'inline-source-map' : '',
    plugins: (debug ? require('./debug/generate_debug_html.js').concat([
            new webpack.DefinePlugin({
                '__DEV__': true,
                'process.env.NODE_ENV': '"development"'
            }),
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            new webpack.HotModuleReplacementPlugin(),
        ]) : [
            new webpack.DefinePlugin({
                '__DEV__': false,
                'process.env.NODE_ENV': '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin({ minimize: true, sourcemap: false, compress: { warnings: false} }),

        ]),
    module: {
//加载器配置 它告知webpack每一种文件都需要使用什么加载器来处理
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                query:
                      {
                        presets:['react', 'es2015', 'stage-2'],
                        plugins: ['transform-class-properties']
                      },
                exclude: /node_modules/,

            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
    
            },
//.css 文件使用 style-loader 和 css-loader 来处理
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                
            },
            {
                test: /\.(svg|ttf|woff|woff2|eot)/,
                loader: 'url-loader?limit=5000'
            },
            {
                test: /\.html$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
//其它解决方案配置
    resolve: {
        modules: ['.code_root', 'node_modules'],
        extensions: ['.js', '.jsx']
    }
};

/*
if (process.env.npm_lifecycle_script.indexOf('webpack-dev-server') >= 0) {
  try {
    const opn = require('opn'); 
    opn('http://localhost:8008');
  } catch (e) {
  }
}
*/
