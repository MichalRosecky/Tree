/*eslint-env node */
var options = require('./webpack.base.conf');
//options.entry = __dirname + '/../src/components/tree/index.js';
options.entry = {
  app: './src/main.js'
  //app: './src/components/tree/index.js'
},
options.output = {
  filename: 'index.js',
  path: __dirname + '/../dist/',
  library: 'VueDragSortTree',
  libraryTarget: 'umd'
};
module.exports = options;
