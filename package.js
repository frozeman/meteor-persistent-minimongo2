Package.describe({
  name: 'frozeman:persistent-minimongo',
  summary: 'Persistent Client-side Collections for Meteor',
  version: '0.1.1',
  git: 'http://github.com/frozeman/meteor-persistent-minimongo'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.0');

  api.use('underscore', 'client');
  api.use('amplify@1.0.0', 'client');

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