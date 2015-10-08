var data = [
  { firstName: 'Albert', lastName: 'Einstein', email: 'emc2@princeton.edu'      },
  { firstName: 'Marie',  lastName: 'Curie',    email: 'marie.curie@sorbonne.fr' },
  { firstName: 'Max',    lastName: 'Planck',   email: 'max@mpg.de'              }
];
var testCollection = new Mongo.Collection(null);
var testObserver = new PersistentMinimongo2(testCollection, 'persistent-minimongo-test');


// test adding, retrieving and deleting data. the tests are a bit bogus since we can't
// reload the browser to exercise the persistence. the best we can do is to verify that
// amplify has stored the correct data.

Tinytest.addAsync('Local Persist - Insert Data', function(test, done) {


  data.forEach(function (doc) {
    testCollection.insert(doc);
  });


  Meteor.setTimeout(function() {

    // right number of adds?
    test.equal(testObserver._getStats().added, data.length);

    // get the tracking list and verify it has the correct number of keys
    testObserver.store.getItem(testObserver._getKey(), function(e, list) {
      if(!e) {
        test.equal(list.length, data.length);
      } else
        test.isTrue(false);

      done();
    });
  }, 200);
});

Tinytest.addAsync('Local Persist - Retrieve Data', function(test, done) {

  // right number of adds?
  test.equal(testObserver._getStats().added, data.length);

  var count = 0;

  data.forEach(function (doc) {
    var m = testCollection.findOne({ lastName: doc.lastName });

    testObserver.store.getItem(testObserver._makeDataKey(m._id), function(e, a) {
        if(!e) {
          test.equal(a, m);
        } else
          test.isTrue(false);

        count++;

        if(count === data.length)
          done();
    });
  });
});

Tinytest.addAsync('Local Persist - Change Data', function(test, done) {

  // right number of adds?

  var m = testCollection.findOne({ lastName: data[0].lastName });
  testCollection.update(m._id, {$set: {lastName: 'test'}});

  Meteor.setTimeout(function() {
    test.equal(testObserver._getStats().changed, 1);

    testObserver.store.getItem(testObserver._makeDataKey(m._id), function(e, a) {
        if(!e) {
          test.equal(a.lastName, 'test');
        } else
          test.isTrue(false);

        done();
    });
  }, 200);
});

Tinytest.addAsync('Local Persist - Remove Data', function(test, done) {

  // right number of adds?
  test.equal(testObserver._getStats().added, data.length);

  testCollection.remove({});

  // the tracking list should be gone
  Meteor.setTimeout(function() {

    // right number of removes?
    test.equal(testObserver._getStats().removed, data.length);

    // get the tracking list and verify it has the correct number of keys
    testObserver.store.getItem(testObserver._getKey(), function(e, list) {
      if(!e) {
        test.equal(!! list, false);
      } else
        test.isTrue(false);

      done();
    });
  }, 300);
  
});
