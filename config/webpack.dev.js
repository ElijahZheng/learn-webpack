const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  // 追踪错误和警告的位置
  devtool: 'inline-source-map',
  // 实时重新加载
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'dist'),
    hot: true
  },
  // 插件
  plugins: [
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.HotModuleReplacementPlugin(),
  ]
})
