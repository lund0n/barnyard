const { resolve } = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const root = resolve(__dirname)

module.exports = (env = {}) => {
	return {
		context: resolve(root),
		entry: {
			main: './src/index.js',
		},
		output: {
			path: resolve(root, 'dist'),
			publicPath: '/',
			filename: '[name].[chunkhash].js',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
					},
				},
			],
		},
		plugins: [
			new CleanWebpackPlugin(['dist']),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(
					env.production ? 'production' : 'development'
				),
			}),
			new HtmlWebpackPlugin({
				title: 'Barnyard',
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: ({ context }) =>
					context && context.indexOf('node_modules') !== -1,
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
			}),
		].concat(
			env.production
				? new webpack.optimize.UglifyJsPlugin({
						sourceMap: true,
					})
				: []
		),
		devtool: env.production ? 'source-map' : 'cheap-module-eval-source-map',
		devServer: {
			compress: true,
			contentBase: resolve(root, 'dist'),
			open: false,
			port: 3000,
			publicPath: '/',
			proxy: [
				{
					path: '/',
					target: 'ws://localhost:3001/',
					ws: true,
				},
			],
		},
	}
}
