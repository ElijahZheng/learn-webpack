var express = require('express')
var config = require('./config/webpack.prod')

var port = 8018

var app = express()

const proxy = require('http-proxy-middleware') // 引入代理中间件

// var options = {
//   target: 'http://localhost:8888', // target host
//   changeOrigin: true // needed for virtual hosted sites
// }

// var exampleProxy = proxy(options)
// app.use('/api', exampleProxy)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
