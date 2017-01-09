const nconf = require('nconf');
const util = require('util');
nconf.use('memory')
  .argv()
  .env()
  .file({
    file: util.format('%s/%s.yaml', __dirname, process.env.NODE_ENV || 'development'),
    format: require('nconf-yaml')
  });
nconf.set('test', ~[ 'test', 'development' ].indexOf(process.env.NODE_ENV || 'development'));
module.exports = nconf;
