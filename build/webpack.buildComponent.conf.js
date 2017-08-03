
var options = require('./webpack.base.conf');
options.entry = {
  app: './src/components/tree/index.js'
},
options.output = {
  filename: 'index.js',
  path: __dirname + '/../dist/',
  library: 'VueDragSortTree',
  libraryTarget: 'umd'
};
module.exports = options;
