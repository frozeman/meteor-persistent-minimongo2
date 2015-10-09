Package.describe({
  name: 'frozeman:persistent-minimongo2',
  summary: 'Persistent Client-side Collections for Meteor using indexedDB, webSQL or localstorage',
  version: '0.3.4',
  git: 'http://github.com/frozeman/meteor-persistent-minimongo'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.0');

  api.use('underscore', 'client');

  api.export('PersistentMinimongo2', 'client');

  api.add_files('localforage.js', 'client');
  api.add_files('persistent-minimongo.js', 'client');
});

Package.on_test(function (api) {
  api.use('tinytest', 'client');
  api.use('mongo', 'client');
  api.use('frozeman:persistent-minimongo2', 'client');
  api.add_files('persistent-minimongo-tests.js', 'client');
});