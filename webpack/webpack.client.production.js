const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const { cpus } = require('os');

const { client, createSelectorName } = require('./common');
const paths = require('./paths');

module.exports = merge(client, {
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        parallel: cpus().length,
        uglifyOptions: {
          compress: {
            warnings: false,
            comparisons: false
          },
          output: {
            comments: false,
            ascii_only: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { map: { inline: false, annotations: true } } })
    ]
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              context: paths.root,
              localIdentName: '[local][hash:base64:5]',
              getLocalIdent: createSelectorName
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [paths.nodeModules, paths.assets]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ManifestPlugin({ fileName: 'asset-manifest.json' }),
    new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' })
  ]
});
