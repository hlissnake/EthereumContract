const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const PATHS = {
	app: path.join(__dirname),
	build: path.join(__dirname, 'dist'),
	contracts: path.join(__dirname, 'build/contracts'),
	node_modules: path.join(__dirname, 'node_modules')
};

if (!fs.existsSync(PATHS.build)) {
	fs.mkdirSync(PATHS.build);
	fs.mkdirSync(path.join(PATHS.build, 'abi'));
}

if (fs.lstatSync(PATHS.contracts).isDirectory()) {
	const files = fs.readdirSync(PATHS.contracts);
	for(let i = 0; i < files.length; i++) {
		const jsonModule = require(`./build/contracts/${files[i]}`);
		fs.writeFileSync(path.join(PATHS.build, `abi/${files[i]}`), JSON.stringify(jsonModule.abi));
	}
}

module.exports = {
	entry: [
		path.join(PATHS.app, 'web/auth.js')
	],
	resolve: {
		extensions: ['.jsx', '.js']
	},
	output: {
		path: PATHS.build,
		filename: 'main.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			},
			{
				test: /\.css$/,
				loaders: [ 'style', 'css' ]
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},
			// {
			// 	test: /\.js(x|)$/,
			// 	loaders: ['transform-loader?envify', 'babel-loader?cacheDirectory'],
			// 	include: PATHS.app,
			// 	exclude: [PATHS.node_modules]
			// }
		]
	}
};
