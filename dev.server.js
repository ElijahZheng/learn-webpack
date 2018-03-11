const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')

const config = require('./config/webpack.dev.js')
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  compress: true,
  noInfo: true
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)

server.listen(8080, 'localhost', () => {
  console.log('dev server listening on http://localhost:8080')
})
