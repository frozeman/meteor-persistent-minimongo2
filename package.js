Package.describe({
  name: 'hacknlove:persistent-minimongo2',
  summary: 'Persistent Client-side Collections for Meteor using indexedDB, webSQL or localstorage',
  version: '0.4.1',
  git: 'https://github.com/hacknlove/meteor-persistent-minimongo2'
});
Npm.depends({
  'localforage': '1.7.3'
})
Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('ecmascript');
  api.use('underscore', 'client');

  api.export('PersistentMinimongo2', 'client');

  api.add_files('persistent-minimongo.js', 'client');
});

Package.on_test(function (api) {
  api.use('tinytest', 'client');
  api.use('mongo', 'client');
  api.use('hacknlove:persistent-minimongo2', 'client');
  api.add_files('persistent-minimongo-tests.js', 'client');
});
