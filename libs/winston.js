// SE PUEDE HACER PROFILING CON ESTE LOGGER

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logger = (appRoot) => {

// Logging levels severity from most important (error) to least important (silly).
// error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5

// You can add or remove transports from the logger
// .clear()            Remove all transports
// .add(console)       Add console transport
// .add(files)         Add file transport
// .remove(console)    Remove console transport

// You can create child loggers from existing loggers to pass metadata overrides
// .child({ requestId: '451' })

// Custom log format  -  Visit logform to see built-in formats
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  transports: [
    new transports.File(options.file)
  ],
  exitOnError: false, // If false, handled exceptions will not exit the process
  silent: false, // If true, all logs are suppressed
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  // format: format.combine(format.splat(), format.simple()),
  // level: 'info', // Log only if level is less than or equal to this level
  // levels
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(options.console));
}


return {
  logger
};
}


module.exports = logger;
