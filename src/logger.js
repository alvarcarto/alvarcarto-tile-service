const path = require('path');
const winston = require('winston');
const _ = require('lodash');
const config = require('./config');

const COLORIZE = config.NODE_ENV === 'development';

function createLogger(filePath) {
  const fileName = path.basename(filePath);

  const formats = [
    winston.format.label({ label: `pid${process.pid}-${fileName}` }),
    winston.format.timestamp(),
    winston.format.printf(
      info => `${info.timestamp} - ${info.level}: [${info.label}] ${info.message}`
    ),
  ];
  if (COLORIZE) {
    formats.push(winston.format.colorize())
  }

  const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    transports: [new winston.transports.Console({
      format: winston.format.combine.apply(winston.format.combine, formats),
    })],
  });

  return logger;
}

module.exports = createLogger;
