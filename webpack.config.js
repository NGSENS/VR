var path = require('path');
var webpack = require('webpack');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  module: {
    loaders: [
      {
        loader: "babel-loader",

        // Skip any files outside the `src` directory
        include: [
          path.resolve(__dirname, "src"),
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          plugins: [
          	'transform-runtime',
          	'transform-object-rest-spread'
          ],
          presets: ['es2015', 'react'],
        }
      }
    ]
  },
  output: {
    filename: PROD ? './dist/bundle.min.js' : './dist/bundle.js'
  },
  entry: [
    './src/index.js'
  ],
  plugins: PROD ? [
	new webpack.DefinePlugin({
		'process.env': {
		'NODE_ENV': JSON.stringify('production')
		}
	}),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : []
};