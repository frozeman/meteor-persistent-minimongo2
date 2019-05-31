Package.describe({
  name: 'hacknlove:persistent-minimongo2',
  summary: 'Persistent Client-side Collections for Meteor using indexedDB, webSQL or localstorage',
  version: '0.4.2',
  git: 'https://github.com/hacknlove/meteor-persistent-minimongo2'
});
Npm.depends({
  'localforage': '1.7.3'
})
Package.onUse(function (api) {
  api.versionsFrom('1.8.0.2')
  api.versionsFrom('METEOR@1.0');
  api.use('ecmascript');
  api.use('underscore', 'client');

  api.export('PersistentMinimongo2', 'client');

  api.add_files('persistent-minimongo.js', 'client');
});

Package.onTest(function (api) {
  api.use('tinytest', 'client');
  api.use('mongo', 'client');
  api.use('hacknlove:persistent-minimongo2', 'client');
  api.add_files('persistent-minimongo-tests.js', 'client');
});
