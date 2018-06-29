const AD = require('ad');
const express = require('express');
const bodyParser = require('body-parser');
const swagpi = require('swagpi');
const vorpal = require('vorpal')();

const swagpiConfig = require('./src/swagpi.config.js');
const loadConfig = require('./src/loadConfig');
const routes = require('./src/routes');
const commands = require('./src/commands');
const middleware = require('./middleware');
const chalk = vorpal.chalk;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

middleware.call(app);

swagpi(app, {
  logo: './src/img/logo.png',
  config: swagpiConfig
});

const init = args => {
  try {
    const config = loadConfig(args);
    const ad = new AD(config).cache(true);
    app.listen(config.port || 3000);
    routes(app, config, ad);
    vorpal.use(commands, { ad });
    vorpal.log(
      `Addict Active Directory API\nListening on port ${config.port || 3000}`
    );
  } catch (err) {
    vorpal.log(err.message);
    process.exit();
  }
};

vorpal
  .command('_start')
  .hidden()
  .option('-u, --user [user]', 'Domain admin username.')
  .option('-p, --pass [pass]', 'Domain admin password.')
  .option('--url [url]', 'URL for Active Directory.')
  .option('--port [port]', 'Port to listen on.')
  .option('--cors [allowed-origin]', 'CORS allowed-origin URL (use * to allow from everywhere).')
  .action(function(args, cbk) {
    init(args);
    cbk();
  });

vorpal.exec(`_start ${process.argv.slice(2).join(' ')}`);
vorpal.delimiter(chalk.cyan('Addict:')).show();
