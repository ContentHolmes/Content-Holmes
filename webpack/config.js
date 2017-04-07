const path = require('path');

module.exports = {
  entry: {
    sentiment: './src/js/sentiment',
    event: './src/js/event',
    URLBlocker: './src/js/URLBlocker',
    options: './src/options',
    popup: './src/popup',
    dashboard: './src/js/dashboard',
    content_script: './src/js/content_script',
    'jquery-2.1.4.min': './src/js/jquery-2.1.4.min',
    redirect: './src/js/redirect',
    'socket.io': './src/js/socket.io',
    URLBlock: './src/js/URLBlock',
    URLInviz: './src/js/URLInviz',
    'bootstrap.min': './src/js/bootstrap.min'

  },
  output: {
    filename: './js/[name].js'
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, '../src/js')
    }]
  }
};
