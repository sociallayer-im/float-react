const { CheckerPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { optimize } = require('webpack');
const { join } = require('path');
let prodPlugins = [];
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push(
    new optimize.AggressiveMergingPlugin()
  );
}

console.log('NODE_ENV', process.env.NODE_ENV)
module.exports = {
  mode: process.env.NODE_ENV,
  // devtool: 'inline-source-map',
  entry: {
    injectTwitter: join(__dirname, './src/contentscript/injectTwitter/index.tsx'),
    injectSola: join(__dirname, './src/contentscript/injectSola/index.ts'),
    background: join(__dirname, './src/background/index.ts'),
    popup: join(__dirname, './src/popup/popup.tsx'),
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}',
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          {
            loader:'awesome-typescript-loader',
            options:{
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    ...prodPlugins,
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  },
};
