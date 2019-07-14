const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/lib/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: { configFileName: 'tsconfig-lib.json' },
      },
    ],
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  output: {
    filename: 'xstate-react-hoc.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'xstate-react-hoc',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
