// Export a function that takes 'args' as an argument
module.exports = args => {
  // Initialize 'config' variable
  let config;

  try {
    // Try to load the configuration from '../config.json'
    config = require('../config.json');
  } catch (e) {
    // If there's an error, initialize 'config' as an empty object
    config = {};
  }

  // Override 'config' properties with environment variables if they exist
  config.user = process.env.ADDICT_USER || config.user;
  config.pass = process.env.ADDICT_PASS || config.pass;
  config.url = process.env.ADDICT_URL || config.url;
  config.port = process.env.ADDICT_PORT || config.port;
  config.cors = process.env.ADDICT_CORS || config.cors;

  // Override 'config' properties with command-line arguments if they exist
  config.user = args.options.user || config.user;
  config.pass = args.options.pass || config.pass;
  config.url = args.options.url || config.url;
  config.port = args.options.port || config.port;
  config.cors = args.options.cors || config.cors;

  // Environment identifier: supports ADDICT_ENV or NODE_ENV, default to 'development'
  config.env = process.env.ADDICT_ENV || process.env.NODE_ENV || config.env || 'development';

  // Initialize 'missing' array to store missing configuration properties
  const missing = [];

  // Check if 'config.user' is missing and add it to 'missing' if true
  if (!config.user) {
    missing.push('user');
  }
  // Check if 'config.pass' is missing and add it to 'missing' if true
  if (!config.pass) {
    missing.push('pass');
  }
  // Check if 'config.url' is missing and add it to 'missing' if true
  if (!config.url) {
    missing.push('url');
  }

  // If any required configuration properties are missing, throw an error
  if (missing.length > 0) {
    throw new Error(`No ${missing.join(', ')} specified in config.`);
  }

  // Return the final 'config' object
  return config;
};

