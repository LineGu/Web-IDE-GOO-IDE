const path = require('path');
const webpack = require('webpack');

const configUtil = require('./webpack.config.util.js');

module.exports = {
	name: 'server',
	mode: configUtil.mode,
	target: 'node',
	entry: {
		AccountApp: path.resolve('./src/apps/account/server.jsx'),
		WorkspaceApp: path.resolve('./src/apps/workspace/server.jsx')
	},
	node: {
		__dirname: true,
		__filename: true
	},
	output: {
		path: path.resolve(__dirname, 'dist/server'),
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
	resolve: configUtil.resolve,
	module: {
		rules: [
			{
				test: /\.(jsx|js)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true
						}
					}
				]
			},
			{
				test: /\.(css|scss)$/,
				use: [
					'isomorphic-style-loader',
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 2,
							modules: true,
							context: __dirname,
							localIdentName: configUtil.isDev
								? '[name]__[local]__[hash:base64:6]'
								: '[hash:base64:6]'
						}
					},
					configUtil.postcssLoader,
					configUtil.sassLoader
				],
				exclude: /node_modules/,
				include: path.resolve(__dirname, 'src')
			},
			{
				test: /\.(css|scss)$/,
				use: [
					'isomorphic-style-loader',
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 2,
							modules: true,
							context: __dirname,
							localIdentName: configUtil.isDev
								? '[name]__[local]__[hash:base64:6]'
								: '[hash:base64:6]'
						}
					}
				],
				include: /node_modules/,
				exclude: path.resolve(__dirname, 'src')
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(configUtil.mode),
			'process.env.BROWSER': false
		})
	]
};