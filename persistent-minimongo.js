/**
Packages

@module Packages
*/

/**
The PersistentMinimongo package

@class PersistentMinimongo
@constructor
*/



/**
If the localstorage goes over 4.8 MB, trim the collections.

@property capLocalStorageSize
*/
var capLocalStorageSize = 4.8;

/**
If the localstorage goes over `capLocalStorageSize`, trim the current collection,
which wanted to add a new entry, by 50 entries.

@property trimCollectionBy
*/
var trimCollectionBy = 50;


PersistentMinimongo = function (collection) {
    var self = this;
    if (! (self instanceof PersistentMinimongo))
            throw new Error('use "new" to construct a PersistentMinimongo');

    self.key = 'minimongo__' + collection._name;
    self.col = collection;
    self.cur = self.col.find({});
    self.stats = { added: 0, removed: 0, changed: 0 };

    persisters.push(self);

    // Meteor.startup(function () {
        // load from storage
        self.refresh(true);

        self.cur.observe({
            added: function (doc) {

                // Check if the localstorage is to big and reduce the current collection by 50 items
                self.capCollection();

                // get or initialize tracking list
                var list = amplify.store(self.key);
                if (! list)
                    list = [];

                // add document id to tracking list and store
                if (! _.contains(list, doc._id)) {
                    list.push(doc._id);
                    amplify.store(self.key, list);
                }

                // store copy of document into local storage, if not already there
                var key = self._makeDataKey(doc._id);
                if(! amplify.store(key)) {
                    amplify.store(key, doc);
                }

                ++self.stats.added;
            },

            removed: function (doc) {
                var list = amplify.store(self.key);

                // if not in list, nothing to do
                if(! _.contains(list, doc._id))
                    return;

                // remove from list
                list = _.without(list, doc._id);

                // remove document copy from local storage
                amplify.store(self._makeDataKey(doc._id), null);

                // if tracking list is empty, delete; else store updated copy
                amplify.store(self.key, list.length === 0 ? null : list);

                ++self.stats.removed;
            },

            changed: function (newDoc, oldDoc) {
                // update document in local storage
                amplify.store(self._makeDataKey(newDoc._id), newDoc);
                ++self.stats.changed;
            }
        });
    // });
};

PersistentMinimongo.prototype = {
    constructor: PersistentMinimongo,
    _getStats: function () {
        return this.stats;
    },
    _getKey: function () {
        return this.key;
    },
    _makeDataKey: function (id) {
        return this.key + '__' + id;
    },
    /**
    Refresh the local storage
    
    @method refresh
    @return {String}
    */
    refresh: function (init) {
        var self = this;
        var list = amplify.store(self.key);
        var dels = [];

        self.stats.added = 0;

        if (!! list) {
            var length = list.length;
            list = _.filter(list, function (id) {
                var doc = amplify.store(self._makeDataKey(id));
                if(!! doc) {
                    var d = self.col.findOne({ _id: doc._id });
                    if(d)
                        self.col.update({ _id: d._id }, doc);
                    else
                        self.col.insert(doc);
                }

                return !! doc;
            });

            // if not initializing, check for deletes
            if(! init) {
                self.col.find({}).forEach(function (doc) {
                    if(! _.contains(list, doc._id))
                        dels.push(doc._id);
                });

                _.each(dels, function (id) {
                    self.col.remove({ _id: id });
                });
            }

            // if initializing, save cleaned list (if changed)
            if(init && length != list.length)
                amplify.store(self.key, list.length === 0 ? null : list);
        }
    },
    /**
    Gets the current localstorage size in MB
    
    @method localStorageSize
    @return {String} total localstorage size in MB
    */
    localStorageSize: function() {

      // function toSizeMB(info) {
      //   info.size = toMB(info.size).toFixed(2) + ' MB';
      //   return info;
      // }

      // var sizes = Object.keys(localStorage).map(toSize).map(toSizeMB);
      // console.table(sizes);

      var size = 0;
      _.each(Object.keys(localStorage), function(key){
        size += localStorage[key].length * 2 / 1024 / 1024;
      });
      
      return size;
    },
    /**
    Check if the localstorage is to big and reduce the current collection by 50 items
    
    @method localStorageSize
    @return {String}
    */
    capCollection: function(){
        var _this = this;

        if(_this.localStorageSize() > capLocalStorageSize) {
            console.log(_this.localStorageSize(), _this.col.find({}).count());
            // find the first 50 entries and remove them
            _.each(_this.col.find({}, {limit: trimCollectionBy}).fetch(), function(item){
                _this.col.remove(item._id);
            });
        }
    }
};

var persisters = [];
var lpTimer = null;

// React on manual local storage changes
Meteor.startup(function () {
    $(window).bind('storage', function (e) {
        Meteor.clearTimeout(lpTimer);
        lpTimer = Meteor.setTimeout(function () {
            _.each(persisters, function (lp) {
                lp.refresh(false);
            });
        }, 250);
    });
});
