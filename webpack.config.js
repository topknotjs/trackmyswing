var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
module.exports = {
    entry: {
        home: "./src/client/index.ts",
        server: "./src/server/server.ts"
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].bundle.js",
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts"]
    },
    // externals: ['express'], 
    module: {
        loaders: [
            {
                test : /\.jsx|js?/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test : /\.ts?/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },            
            {
                test: /\.html$/,
                loader: "file-loader?name=[name].[ext]",
            },
            { 
                test: /\.css$/, 
                loader: "style-loader!css-loader" 
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png)$/,
                loader: "file-loader?name=[path][name].[ext]"
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    // watch: true,
    target: "node"
};