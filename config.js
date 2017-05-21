/* eslint-disable no-process-env */

var path = require('path');

// Env vars should be casted to correct types
var config = {
  PORT: Number(process.env.PORT) || 8002,
  NODE_ENV: process.env.NODE_ENV,
  CACHE_DIR: process.env.CACHE_DIR || './cache',
  DISABLE_CACHE: process.env.DISABLE_CACHE === 'true',
  STYLE_DIR: process.env.STYLE_DIR || '/home/alvar/mapnik-styles',
};

console.log('Tile cache directory:', config.CACHE_DIR);
console.log('Mapnik styles directory:', config.STYLE_DIR);

module.exports = config;