var path = require('path');
var express = require('express');
var tilestrata = require('tilestrata');
var disk = require('tilestrata-disk');
var mapnik = require('tilestrata-mapnik');

var dataDir = process.argv[2] || './cache';
console.log('Using following directory to cache tiles: ', dataDir);

var strata = tilestrata();
strata.layer('bw')
  .route('tile.png')
  .use(disk.cache({ dir: path.join(dataDir, 'tiles/bw/') }))
  .use(mapnik({
    pathname: '../mapnik-styles/bw.xml',
    tileSize: 256
  }))

strata.layer('transparent')
  .route('tile.png')
  .use(disk.cache({ dir: path.join(dataDir, 'tiles/transparent/') }))
  .use(mapnik({
    pathname: '../mapnik-styles/transparent.xml',
    tileSize: 256
  }));

strata.listen(8080);
