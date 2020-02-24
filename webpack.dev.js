const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  // 入口
  entry: './src/home/index.js',

  output: {
    filename: '[name]_chunk.js',
    // filename: '[name].js' 占位符 多入口文件
    path: path.resolve(__dirname, 'dist')
  },
  // 模块 处理项目不同类型的模块

  // loaders babel-loader css-loader less-loader ts-loader file-loader raw-loader thread-loader(多进程打包)
  module: {
    rules: [
      // 解析Es6 
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      
      // 解析CSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // 解析Less
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // 解析图片
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          // 'file-loader', or
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name][hash:8].[ext]',
              limit: 10240
            }
          }
        ]
      },
      // 解析字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // new CleanWebpackPlugin(),

    new webpack.HotModuleReplacementPlugin(),

    // new MiniCssExtractPlugin({
    //   filename: '[name][contenthash:8].css'
    // })
  ],

  // wds 热更新配置
  devServer: {
    contentBase: './dist/',
    hot: true
  },

  mode: 'development', // 'development'

  devtool: 'inline-source-map',


  // mode: 'development'
  // 开启 process.env.NODE_ENV = 'development'




  // 文件指纹  Hash ChunkHash（每个页面变化不会影响其他的页面）ContentHash （CSS文件）
  
}
