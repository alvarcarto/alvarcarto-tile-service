const path = require('path');
const _ = require('lodash');
const tilestrata = require('tilestrata');
const disk = require('tilestrata-disk');
const mapnik = require('tilestrata-mapnik');
const glob = require('glob');
const config = require('./config');
const mapnikUtil = require('./mapnik-util');

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
  var autogenStylePath = mapnikUtil.replacePostgisParametersFileSync(stylePath);
  console.log('Mapnik style path:', stylePath);
  layer.use(mapnik({
    pathname: autogenStylePath,
    tileSize: 256
  }));
}

function getStyleIdsSync(dir) {
  var files = _.filter(glob.sync(config.STYLE_DIR + '/*.xml'), filePath => !_.endsWith(filePath, `${mapnikUtil.AUTOGEN_SUFFIX}.xml`));
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
