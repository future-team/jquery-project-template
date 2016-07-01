var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var extend = require('extend');
var entry = require('./src/config/vendor');
var externals = require('./src/config/externals');
var alias = require('./src/config/alias');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//?presets[]=stage-0,presets[]=react,presets[]=es2015

var setExternals= function() {
    var external=externals;

    return external;
};

var baseFileDir = path.join(process.cwd(), 'src/');

var getEntry = function(){
    var basedir =baseFileDir+'action';
    var files = glob.sync(path.join(basedir, '*.js'));

    var webpackConfigEntry = {};//webpackConfig.entry || (webpackConfig.entry = {});

    files.forEach(function(file) {
        var relativePath = path.relative(basedir, file);
        webpackConfigEntry[relativePath.replace(/\.js/,'').toLowerCase()] = file;
    });
    return webpackConfigEntry;
};


function setCommonsChuck(){
    var arr=[];
    for(var item in entry){
        arr.push(item);
    }
    return arr;
}


var webpackConfig = {
    entry: extend(getEntry(),entry||{}),
    output: {
        //libraryTarget: 'umd',
        path:path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['', '.js'],
        alias:extend({},alias ||{})
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            }, {
                test: /\.(less$|css)$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                //loader: "style-loader!css-loader!less-loader"
            },
            /*{
                test   : /\.(woff|svg|eot|ttf)\??.*$/,
                loader : 'file-loader'
            },*/
            {
                test: /\.svg$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            }, {
                test: /\.woff|ttf|woff2|eot$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=35000'
            },
            {
                test: /\.html$/,
                loader: "handlebars-loader"
            }
        ]
    },
    externals:setExternals(),
    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin(path.join('[name].css')),
        new webpack.ProvidePlugin({
            $:      "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: setCommonsChuck()/*,
            children: true,
            async: true*/
        })
    ]
};


module.exports = webpackConfig;
