var path = require('path');
var express = require('express');
var tilestrata = require('tilestrata');
var disk = require('tilestrata-disk');
var mapnik = require('tilestrata-mapnik');
var glob = require('glob');
var config = require('./config');

var USE_CACHE = !config.DISABLE_CACHE;

function addLayer(strata, styleId) {
  console.log('Add tilestrata layer:', styleId);

  var layer = strata.layer(styleId)
    .route('tile.png')

  if (USE_CACHE) {
    var cacheDir = path.join(config.CACHE_DIR, styleId);
    layer.use(disk.cache({ dir: cacheDir }));
    console.log('Cache dir:', cacheDir);
  }

  var stylePath = path.join(config.STYLE_DIR, styleId + '.xml');
  console.log('Mapnik style path:', stylePath);
  layer.use(mapnik({
    pathname: stylePath,
    tileSize: 256
  }));
}

function getStyleIdsSync(dir) {
  var files = glob.sync(config.STYLE_DIR + '/*.xml');
  return files.map(name => path.basename(name, path.extname(name)));
}

var strata = tilestrata();

var styleIds = getStyleIdsSync(config.STYLE_DIR);
console.log('Found mapnik styles:', styleIds.join(', '));
styleIds.forEach(styleId => addLayer(strata, styleId));

const server = strata.listen(config.PORT);

if (config.HTTP_TIMEOUT_MS) {
  server.timeout = config.HTTP_TIMEOUT_MS;
}
