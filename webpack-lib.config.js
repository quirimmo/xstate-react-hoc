const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/xstate-react-hoc/with-state-machine.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        query: { configFileName: 'tsconfig-lib.json' },
      },
    ],
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MyLib',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
