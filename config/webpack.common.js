const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 多入口管理文件
const entryJSON = require('./entry.json')

// 因为多入口，所以要多个HtmlWebpackPlugin，每个只能管一个入口
let plugins = entryJSON.map(page => {
  return new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, '..', `dist/${page.url}.html`),
    template: path.resolve(__dirname, '..', `src/page/${page.url}/index.html`),
    chunks: [page.url, 'commons'], // 实现多入口的核心，决定自己加载哪个js文件，这里的 page.url 指的是 entry 对象的 key 所对应的入口打包出来的js文件
    // hash: true, // 为静态资源生成hash值
    minify: false, // 压缩，如果启用这个的话，需要使用html-minifier，不然会直接报错
    xhtml: true, // 自闭标签
  })
})

// 入口管理
let entry = {
  // 引入jQuery，这个是为了配合 webpack.optimize.CommonsChunkPlugin 这个插件使用。
}

entryJSON.map(page => {
  entry[page.url] = path.resolve(__dirname, '..', `src/page/${page.url}/index.js`)
})

module.exports = {
  entry: entry,
  // 插件
  plugins: [
    // 清除每次build的文件，保证是最新的
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
      root: path.resolve(__dirname, '../'), // 设置root
      verbose: true
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.SplitChunksPlugin({
      name: true,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    })
  ].concat(plugins),
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..', 'src')
    }
  },
  module: {
    rules: [
      // 转es5
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // css loader
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline'
              }
            }
          ]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline'
              }
            },
            'stylus-loader'
          ]
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          // 转base64
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[ext]'
            }
          },
          // 加载图片 (带压缩)
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              },
              name: 'img/[name].[ext]'
            }
          }
        ]
      },
      // 加载字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
}
