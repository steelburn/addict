// Import required modules
const AD = require('ad'); // Active Directory module
const express = require('express'); // Web framework for Node.js
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const swagpi = require('swagpi'); // Swagger UI middleware for Express
const vorpal = require('vorpal')(); // Interactive command-line interface for Node.js

// Import custom modules
const swagpiConfig = require('./src/swagpi.config.js'); // Swagger UI configuration
const loadConfig = require('./src/loadConfig'); // Load configuration from command line arguments
const routes = require('./src/routes'); // Define application routes
const commands = require('./src/commands'); // Define CLI commands
const middleware = require('./middleware'); // Middleware functions
const chalk = vorpal.chalk; // Terminal string styling

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure CORS headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Apply middleware
middleware.call(app);

// Configure Swagger UI
swagpi(app, {
  logo: './src/img/logo.png',
  config: swagpiConfig
});

// Initialize the application
const init = args => {
  try {
    // Load configuration from command line arguments
    const config = loadConfig(args);

    // Initialize Active Directory with the loaded configuration
    const ad = new AD(config).cache(true);

    // Start the server on the specified port
    app.listen(config.port || 3000);

    // Set up application routes
    routes(app, config, ad);

    // Initialize CLI with commands
    vorpal.use(commands, { ad });

    // Display a success message
    vorpal.log(
      `Addict Active Directory API\nListening on port ${config.port || 3000}`
    );
  } catch (err) {
    // Display an error message and exit the process
    vorpal.log(err.message);
    process.exit();
  }
};

// Define the CLI entry point
vorpal
  .command('_start')
  .hidden() // Hide this command from the CLI help output
  .option('-u, --user [user]', 'Domain admin username.')
  .option('-p, --pass [pass]', 'Domain admin password.')
  .option('--url [url]', 'URL for Active Directory.')
  .option('--port [port]', 'Port to listen on.')
  .option('--cors [allowed-origin]', 'CORS allowed-origin URL (use * to allow from everywhere).')
  .action(function(args, cbk) {
    // Call the init function with the provided command line arguments
    init(args);
    cbk();
  });

// Execute the _start command with the provided command line arguments
vorpal.exec(`_start ${process.argv.slice(2).join(' ')}`);

// Set the CLI delimiter
vorpal.delimiter(chalk.cyan('Addict:')).show();
