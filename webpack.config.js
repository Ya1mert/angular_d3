
//angular es6 webpack https://github.com/AngularClass/NG6-starter/blob/master/client/app/app.js
//webpack https://github.com/webpack/docs/wiki/configuration
//webpack http://webpack.github.io/docs/
//babel-loader https://github.com/babel/babel-loader
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin'); //https://github.com/kevlened/copy-webpack-plugin

var paths = {
  app: 'app.js',
  context: path.join(__dirname, 'wwwroot')
};

module.exports = {
    context: paths.context,
    entry: path.join(path.join(path.join(paths.context, 'src'), 'app'), paths.app),
    output: {
        path: path.join(path.join(paths.context, 'dist'), 'app'),
        filename: paths.app
    },
    module: {
        loaders: [
            {
                text: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                    //plugins: ['transform-runtime']
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(sass|scss)$/, loader: "style-loader!css-loader!sass-loader" },

            { test: /\.jade$/, loader: "html-loader!jade-html-loader" },
            { test: /\.html$/, loader: 'html-loader' },

            { test: /\.(woff|woff2)$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=../fonts/[name].[ext]" },
            { test: /\.ttf$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=../fonts/[name].[ext]" },
            { test: /\.eot$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=../fonts/[name].[ext]" },
            { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=application/svg+xml&name=../fonts/[name].[ext]" }
        ]
    },
    resolve: {
        modulesDirectories : [ 'node_modules', 'bower_components' ],
        extensions : [ '', '.js', '.jsx' ]
    },
    plugins: [
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ], ['normal', 'loader']),
        new CopyWebpackPlugin([
            {
                from: path.join(path.join(paths.context, 'src'), 'index.html'),
                to: path.join(path.join(paths.context, 'dist'), 'index.html')
            }
        ])
    ]
};
