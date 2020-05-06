const path = require('path');
const _ = require('lodash');
const tilestrata = require('tilestrata');
const disk = require('tilestrata-disk');
const headers = require('tilestrata-headers');
const mapnik = require('tilestrata-mapnik');
const glob = require('glob');
const config = require('./config');
const mapnikUtil = require('./mapnik-util');
const logger = require('./logger')(__filename);

var USE_CACHE = !config.DISABLE_CACHE;

function addLayer(strata, styleId) {
  logger.info(`Add tilestrata layer: ${styleId}`);

  const layer = strata.layer(styleId)
    .route('tile.png')

  if (USE_CACHE) {
    const cacheDir = path.join(config.CACHE_DIR, styleId);
    layer.use(disk.cache({ dir: cacheDir }));
    layer.use(headers({ 'Cache-Control': 'max-age=3600' }));
    logger.info(`Cache dir: ${cacheDir}`);
  } else {
    logger.info(`Disk cache and http cache headers disabled!`);
    layer.use(headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }));
  }

  const stylePath = path.join(config.STYLE_DIR, styleId + '.xml');
  const autogenStylePath = mapnikUtil.replacePostgisParametersFileSync(stylePath);
  logger.info(`Mapnik style path: ${stylePath}`);
  layer.use(mapnik({
    pathname: autogenStylePath,
    tileSize: 256
  }));
}

function getStyleIdsSync(dir) {
  const files = _.filter(glob.sync(dir + '/*.xml'), filePath => !_.endsWith(filePath, `${mapnikUtil.AUTOGEN_SUFFIX}.xml`));
  return files.map(name => path.basename(name, path.extname(name)));
}

function createServer() {
  const strata = tilestrata();

  logger.info('Mapnik styles directory:', config.STYLE_DIR);
  const styleIds = getStyleIdsSync(config.STYLE_DIR);
  logger.info(`Found mapnik styles: ${styleIds.join(', ')}`);
  styleIds.forEach(styleId => addLayer(strata, styleId));

  return strata;
}

module.exports = createServer;
