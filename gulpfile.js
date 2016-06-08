var gulp = require('gulp');
var path = require('path');
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var open = require('gulp-open');
var webpackConfig = require('./webpack.config');
var less = require('gulp-less');
var recombiner=require('cortex-recombiner');
var runSequence = require('run-sequence').use(gulp);
var includer = require('gulp-htmlincluder');

var devPort = 3005;

var resource = './src/resources';

gulp.task('open', function () {
  gulp.src(__filename)
      .pipe(open({uri: "http://127.0.0.1:" + devPort + "/src/resources/index.html"}));
});

gulp.task('hot', function (callback) {
  process.env.NODE_ENV ='dev';
  console.dir( process.env.NODE_ENV);
  var wbpk = Object.create(webpackConfig);
  wbpk.devtool = 'eval';
  wbpk.entry = [
    'webpack-dev-server/client?http://127.0.0.1:' + devPort,
    'webpack/hot/only-dev-server',
    './src/index.js'
  ];
  //wbpk.module.loaders.push({
  //  test: /\.less$/,
  //  loader: "style-loader!css-loader!less-loader"
  //});
  wbpk.module.loaders = [
    {
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    },
    {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
    },
    {
      test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader : 'file-loader'
    },
    {
      test: /\.html$/,
      loader: "handlebars-loader"
    },
    {
      test: /\.css$/, loader: "style!css"
    },
    {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=35000'
    }
  ];
  wbpk.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $:      "jquery",
      jQuery: "jquery"
    })
  ];
  wbpk.externals=null;
  wbpk.resolve.extensions = ['', '.js', '.jsx'];
  wbpk.output={
    libraryTarget: 'umd',
    path:path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  };
  var compiler = webpack(wbpk);

  new WebpackDevServer(compiler, {
    publicPath: '/dist/',
    hot: true,
    historyApiFallback: true,
    port: devPort,
    stats: {
      colors: true
    }
  }).listen(devPort, "127.0.0.1", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        //gutil.log("[webpack-dev-server]", "http://127.0.0.1:" + devPort + "/webpack-dev-server/html/index.html");
      });


});

gulp.task('cortex-recombiner', function() {
  return recombiner({
    base:__dirname,//项目根目录
    noBeta:true
  });
});

gulp.task('min-webpack', function (done) {
  var wbpk = Object.create(webpackConfig);
  wbpk.output.filename = '[name].min.js';
  wbpk.plugins.push(new webpack.optimize.UglifyJsPlugin());

  webpack(wbpk).run(function (err, stats) {
    if (err) throw new gutil.PluginError("min-webpack", err);
    gutil.log("[min-webpack]", stats.toString({
    }));
    done();
  });
});

gulp.task('webpack', function (callback) {
  webpack(
      webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
          // output options
        }));
        callback();
      });
});

gulp.task('html-includer', function() {
  return gulp.src(resource+'/**/*.html')
      .pipe(includer())
      .on('error', console.error)
      .pipe(gulp.dest('html'));
});

gulp.task('default', function(){
  runSequence('cortex-recombiner','webpack','min-webpack');
});
gulp.task('dev', ['cortex-recombiner','hot', 'open']);

gulp.task('watch', function() {
  gulp.watch([resource+'/**/*.html'],["html-includer"]);
});