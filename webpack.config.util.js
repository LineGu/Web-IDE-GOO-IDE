const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode =
	process.env.NODE_ENV && process.env.NODE_ENV === 'development' ? 'development' : 'production';
const isDev = mode === 'development';
const postcssLoader = {
	loader: require.resolve('postcss-loader'),
	options: {
		ident: 'postcss',
		plugins: () => [
			autoprefixer({
				browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
				flexbox: 'no-2009'
			})
		]
	}
};
const sassLoader = {
	loader: require.resolve('sass-loader'),
	options: {}
};

module.exports = {
	mode,
	isDev,
	postcssLoader,
	sassLoader,
	inlineCssRule: {
		test: /\.(css|scss)$/,
		use: [
			'style-loader',
			{
				loader: require.resolve('css-loader'),
				options: {
					importLoaders: 1,
					modules: true,
					localIdentName: isDev ? '[name]__[local]' : '[hash:base64]'
				}
			},
			postcssLoader,
			sassLoader
		]
	},
	extractCssRule: {
		test: /\.(css|scss)$/,
		use: [
			{
				loader: MiniCssExtractPlugin.loader
			},
			{
				loader: require.resolve('css-loader'),
				options: {
					importLoaders: 2,
					modules: true,
					context: __dirname,
					localIdentName: isDev ? '[name]__[local]__[hash:base64:6]' : '[hash:base64:6]'
				}
			},
			postcssLoader,
			sassLoader
		],
		include: path.resolve(__dirname, 'src'),
		exclude: [/node_modules/, /\.global\.css$/]
	},
	extractNodeCssRule: {
		test: /\.(css|scss)$/,
		use: [
			{
				loader: MiniCssExtractPlugin.loader
			},
			{
				loader: require.resolve('css-loader'),
				options: {
					importLoaders: 1,
					modules: true,
					localIdentName: '[local]'
				}
			}
		],
		include: /node_modules/
	},
	resolve: {
		extensions: ['.js', '.jsx', 'json'],
		alias: {
			pages: path.resolve(__dirname, './src/pages'),
			components: path.resolve(__dirname, './src/components')
		}
	}
};