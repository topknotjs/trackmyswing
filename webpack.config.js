const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'public');
module.exports = {
	entry: {
		index: './src/client/index.jsx',
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].bundle.js',
		sourceMapFilename: '[name].map',
	},
	module: {
		loaders: [
			{
				test: /\.jsx|js?/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: [
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-proposal-class-properties',
						],
					},
				},
			},
			{
				test: /\.html$/,
				loader: 'file-loader?name=[name].[ext]',
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loaders: [
					'style-loader',
					'css-loader',
					'resolve-url-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(jpe?g|png)$/,
				loader: 'file-loader?name=[path][name].[ext]',
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /node_modules/,
				loader:
					'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]',
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /node_modules/,
				loader:
					'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]',
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader?name=fonts/[name].[ext]',
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: 'src/client/shared/assets/images', to: 'images' },
		]),
	],
};
