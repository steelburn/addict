// Importing 'chalk' for colorizing console output and 'vorpal' for creating the CLI app.
// The function also receives an 'ad' object, which is an instance of the Amadeus API client.

// Initializing an empty 'chalk' variable to be assigned the Vorpal chalk instance later.
let chalk;
const logger = require('./logger');

// The 'formatJSON' function takes a JSON object as input and returns a formatted string.
// It's used to make the console output more readable.
const formatJSON = json => {
  let out = [''];
  json = Array.isArray(json) ? json : [json];
  let divider = json.length > 1 ? '  ---------------------' : undefined;
  json.forEach(obj => {
    for (const item in obj) {
      if (typeof obj[item] === 'string') {
        out.push(`  ${chalk.yellow(item)}: ${obj[item]}`);
      }
    }
    if (divider) {
      out.push(divider);
    }
  });
  out.push('');
  return out.join('\n');
};

// The main function takes 'vorpal' and 'ad' objects as input.
// It sets the 'chalk' variable to the Vorpal chalk instance and adds a 'user' command to the CLI app.
module.exports = function(vorpal, { ad }) {
  chalk = vorpal.chalk;
  vorpal.command('user <user>').action(function(args, cb) {
    // The command fetches user data using the 'ad.user(args.user).get()' method.
    // If the request is successful, it logs the user data in a formatted way using 'this.log(formatJSON(user))'.
    // If there's an error, it logs the error message.
    return ad
      .user(args.user)
      .get()
      .then(user => {
        return logger.logContext(this, formatJSON(user));
      })
      .catch(err => {
        logger.logContext(this, err);
      });
  });
};
