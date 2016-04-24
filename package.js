Package.describe({
  name: 'frozeman:persistent-minimongo2',
  summary: 'Persistent Client-side Collections for Meteor using indexedDB, webSQL or localstorage',
  version: '0.4.0',
  git: 'http://github.com/frozeman/meteor-persistent-minimongo'
});

Npm.depends({localforage: '1.4.0'});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.3');

  api.use('underscore', 'client');
  api.use('ecmascript', 'client');
  api.use('modules', 'client');

  api.mainModule('persistent-minimongo.js', 'client');
});

Package.on_test(function (api) {
  api.use('tinytest', 'client');
  api.use('mongo', 'client');
  api.use('ecmascript', 'client');
  api.use('frozeman:persistent-minimongo2', 'client');
  api.add_files('persistent-minimongo-tests.js', 'client');
});