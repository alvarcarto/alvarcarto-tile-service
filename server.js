var path = require('path');
var express = require('express');
var tilestrata = require('tilestrata');
var disk = require('tilestrata-disk');
var mapnik = require('tilestrata-mapnik');
var config = require('./config');

var useCache = !config.DISABLE_CACHE;

var strata = tilestrata();

const bwLayer = strata.layer('bw')
  .route('tile.png')
if (useCache) {
  bwLayer.use(disk.cache({ dir: path.join(config.CACHE_DIR, 'bw/') }))
}
bwLayer.use(mapnik({
  pathname: path.join(config.STYLE_DIR, 'bw.xml'),
  tileSize: 256
}));

const transparentLayer = strata.layer('transparent')
  .route('tile.png')
if (useCache) {
  transparentLayer.use(disk.cache({ dir: path.join(config.CACHE_DIR, 'transparent/') }))
}
transparentLayer.use(mapnik({
  pathname: path.join(config.STYLE_DIR, 'transparent.xml'),
  tileSize: 256
}));

strata.listen(config.PORT);
