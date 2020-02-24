const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

// webpack 配置
const config = require('./webpack.config.js')

// dev-server 配置
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
}

// 启动HRM 将dev-server 配置添加到 webpack config 中
webpackDevServer.addDevServerEntrypoints(config, options)

const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)

server.listen(8088, 'localhost', () => {
  console.log('dev server listening on port 8080');
})