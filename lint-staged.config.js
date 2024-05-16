// This module exports a single object with a '*.js' property.
// The '*.js' property is a shorthand for matching all files in the project
// with the '.js' file extension.

module.exports = {
  // This property's value is an array of two commands to be executed in order.
  '*.js': ['prettier --write --single-quote', 'git add']
  // The first command in the array is 'prettier --write --single-quote',
  // which is a code formatting tool that will automatically format all
  // matched '.js' files with single quotes and save the changes.
  // The second command is 'git add', which will stage all changes made
  // by the previous command for commit.
};
