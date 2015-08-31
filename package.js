Package.describe({
  name: 'frozeman:persistent-minimongo2',
  summary: 'Persistent Client-side Collections for Meteor using indexedDB, webSQL or localstorage',
  version: '0.2.0',
  git: 'http://github.com/frozeman/meteor-persistent-minimongo'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.0');

  api.use('underscore', 'client');

  api.use('raix:localforage@1.2.6');

  api.add_files('persistent-minimongo.js', 'client');

  api.export('PersistentMinimongo', 'client');
});

Package.on_test(function (api) {
  // api.use('underscore', 'client');
  // api.use('amplify', 'client');
  api.use('tinytest', 'client');
  api.use('frozeman:persistent-minimongo', 'client');
  api.add_files('persistent-minimongo-tests.js', 'client');
});