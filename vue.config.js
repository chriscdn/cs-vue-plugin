const outputDir = "C:/OPENTEXT/support/rhcore/vue-widgets/"
const webpack = require('webpack')

module.exports = {
	// outputDir,
	configureWebpack: {
		plugins: [
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
		]
	},
	transpileDependencies: ['@kweli/cs-rest']
}