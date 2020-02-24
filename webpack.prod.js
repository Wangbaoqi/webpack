const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const webpack = require('webpack')

const setMPA = () => {

  const entry = {};
  const htmlWebpackPlugins = []

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  const names = ['home', 'index']

  // console.log('entryFiles', entryFiles)
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index]


      // const matchs = entryFiles.match(/src\(.*)\/index\.js/)



      let pageName = ''


      names.map(e => {

        if(entryFile.includes(`src/${e}`)) {
          pageName = e
          entry[e] = entryFile
        }
      })

      // console.log('entry', entry)


      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['vendors', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace:true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: false,
            removeComments: false
          }
        })
      )
    })


  return {
    entry,
    htmlWebpackPlugins
  }

}

const { entry, htmlWebpackPlugins } = setMPA()

console.log('setMPA()', setMPA())


module.exports = {
  // 入口
  entry: entry,
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
        use: ['babel-loader', 'eslint-loader']
      },
      // 解析CSS
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',

          'css-loader'
        ]
      },
      // 解析Less
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'less-loader', 
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          }, {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          }
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
              name: '[name]_[hash:8].[ext]',
              limit: 10240
            }
          }
        ]
      },
      // 解析字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              limit: 10240
            }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(),

    // 把CSS提取成一个单独的文件
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),

    // 压缩CSS
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),

    // scope hositing
    new webpack.optimize.ModuleConcatenationPlugin(),
    

    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React'
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM'
        }
      ]
    })

    // 压缩HTML
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'src/index.html'),
    //   filename: 'index.html',
    //   chunks: ['index'],
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace:true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false
    //   }
    // })
  ].concat(htmlWebpackPlugins),

  // optimization: {
  //   splitChunks: {
      // chunks: 'async',
      // minSize: 30000,
      // maxSize: 0,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // automaticNameDelimiter: '~',
      // name: true,
      // cacheGroups: {
      //   vendors: {
      //     test: /(react|react-dom)/,
      //     name: 'vendors',
      //     chunks: 'all'
      //     // priority: -10
      //   },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true
        // }
  //     }
  //   }
  // },

  // optimization: {
  //   splitChunks: {
  //     chunks: 'async',
  //     minSize: 0,
  //     maxSize: 0,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     name: true,
  //     cacheGroups: {
  //       commons: {
  //         name: 'commons',
  //         chunks: 'all',
  //         minChunks: 2
  //       },
  //       vendors: {
  //         test: /(react|react-dom)/,
  //         name: 'vendors',
  //         chunks: 'all',
  //         priority: -10
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // },

  mode: 'production', // 'development'

  // mode: 'development'
  // 开启 process.env.NODE_ENV = 'development'

  devtool: 'inline-source-map',




  // 文件指纹  Hash ChunkHash（每个页面变化不会影响其他的页面）ContentHash （CSS文件）
  
}
