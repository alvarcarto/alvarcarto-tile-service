const cluster = require('cluster');
const createApp = require('./app');
const enableDestroy = require('server-destroy');
const BPromise = require('bluebird');
const logger = require('./logger')(__filename);
const config = require('./config');

BPromise.config({
  warnings: config.NODE_ENV !== 'production',
  longStackTraces: true,
});

function startServer() {
  const app = createApp()

  const server = app.listen(config.PORT, () => {
    logger.info(`Server listening on http://localhost:${config.PORT}/ (Docker might expose different port to host)`);
  });

  if (config.HTTP_TIMEOUT_MS) {
    server.timeout = config.HTTP_TIMEOUT_MS;
  }

  enableDestroy(server);

  function closeServer(signal) {
    logger.info(`${signal} received`);
    logger.info('Closing http.Server ..');
    server.destroy();
  }

  // Handle signals gracefully. Heroku will send SIGTERM before idle.
  process.on('SIGTERM', closeServer.bind(this, 'SIGTERM'));
  process.on('SIGINT', closeServer.bind(this, 'SIGINT(Ctrl-C)'));

  server.on('close', () => {
    logger.info('Server closed');
    process.emit('cleanup');

    logger.info('Giving 100ms time to cleanup..');
    // Give a small time frame to clean up
    setTimeout(process.exit, 100);
  });
}

function startCluster() {
  if (!cluster.isMaster) {
    startServer();
    return;
  }

  logger.info(`Master process with pid ${process.pid} is running`);

  logger.info(`Launching ${config.CLUSTER_INSTANCES} workers`);
  for (let i = 0; i < config.CLUSTER_INSTANCES; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker with pid ${worker.process.pid} died. Signal: ${signal}, code: ${code}`);
    if (config.CLUSTER_INSTANCES < 2) {
      logger.info('Single worker cluster configured, exiting the main process ..');
      process.exit(code);
    }

    logger.info('Launching a new worker ..');
    cluster.fork();
  });
}

// https://stackoverflow.com/questions/32746390/does-node-js-max-old-space-size-include-forked-processes
startCluster();
