/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('app/styles/fonts.css');
  app.import('app/styles/style.css');
  app.import('app/styles/styles.css');
  app.import('app/styles/pygment_trac.css');
  app.import('app/styles/bootstrap.min.css');

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
