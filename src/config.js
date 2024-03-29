/* eslint-disable no-process-env */

var path = require('path');

// Env vars should be casted to correct types
var config = {
  PORT: Number(process.env.PORT) || 8002,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  CLUSTER_INSTANCES: Number(process.env.CLUSTER_INSTANCES) || 1,
  CACHE_DIR: process.env.CACHE_DIR || './cache',
  DISABLE_CACHE: process.env.DISABLE_CACHE === 'true',
  STYLE_DIR: process.env.STYLE_DIR || '/home/alvar/mapnik-styles',
  MAPNIK_POSTGIS_DBNAME: process.env.MAPNIK_POSTGIS_DBNAME,
  MAPNIK_POSTGIS_HOST: process.env.MAPNIK_POSTGIS_HOST,
  MAPNIK_POSTGIS_PORT: process.env.MAPNIK_POSTGIS_PORT,
  MAPNIK_POSTGIS_USER: process.env.MAPNIK_POSTGIS_USER,
  MAPNIK_POSTGIS_PASSWORD: process.env.MAPNIK_POSTGIS_PASSWORD,
};

if (process.env.HTTP_TIMEOUT_MS) {
  // e.g. 20 mins = 20 * 60 * 1000 = 1200000
  config.HTTP_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS);
}

module.exports = config;
