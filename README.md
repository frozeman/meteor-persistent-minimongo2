# Meteor persistent minimongo

It seems that frozeman/meteor-persistent-minimongo2 is unmaintained.


Simple client-side observer class that provides persistence for Meteor Collections using browser storage via [localforage](https://github.com/mozilla/localForage).

[localforage](https://github.com/mozilla/localForage) uses the browsers `indexedDB`, if not available tries `webSQL` and as last option uses `localstorage`.

*package based on [meteor-local-persist](https://github.com/jeffmitchel/meteor-local-persist) by Jeff Mitchel*
*package based on [meteor-local-persist](https://github.com/jeffmitchel/meteor-local-persist) by Jeff Mitchel*


## Installation

`$ meteor add hacknlove:persistent-minimongo2`


## Documentation

### Constructor

```
new PersistentMinimongo2(collection, 'myAppName');
```

`collection` is the Meteor Collection to be persisted.

The last parameter is the apps name and should be used to identifiy your persisted collections inside your storage.
Default is `minimongo`

### Methods:

```js
var myPersistentCollection = new PersistentMinimongo2(collection, 'myAppName', afterInitialisationCallback);

// Refreshes the collections from the storage
myPersistentCollection.refresh()

// If you ever need to clear you storage use
localforage.clear();

// The below is only interesting if your brower doesn't support indexedDB or webSQL:
// Gets the current size of the localstorage in MB
myPersistentCollection.localStorageSize()

// Will check if the current size of the localstorage is larger then 4.8 MB, if so it will remove the 50 latest entries of the collection.
myPersistentCollection.capCollection()
```

## Example:

Implement a simple shopping cart as a local collection.

```js
if (Meteor.isClient) {
    // create a local collection,
    var shoppingCart = new Meteor.Collection('shopping-cart', null);

    // create a local persistence observer
    var shoppingCartObserver = new PersistentMinimongo2(shoppingCart, 'myShoppingApp');

    // create a handlebars helper to fetch the data
    Template.registerHelper("shoppingCartItems", function () {
      return shoppingCart.find();
    });

    // that's it. just use the collection normally and the observer
    // will keep it sync'd to browser storage. the data will be stored
    // back into the collection when returning to the app (depending,
    // of course, on availability of localStorage in the browser).

    shoppingCart.insert({ item: 'DMB-01', desc: 'Discover Meteor Book', quantity: 1 });
  });
}
```

```html
<head>
  <title>Shopping Cart</title>
</head>

<body>
  {{> shoppingCart}}
</body>

<template name="shoppingCart">
  <table>
    <tr>
      <th>Item</th>
      <th>Description</th>
      <th>Quantity</th>
    </tr>
    {{#each shoppingCartItems}}
      <tr>
        <td>{{item}}</td>
        <td>{{desc}}</td>
        <td>{{quantity}}</td>
      </tr>
    {{/each}}
  </table>
</template>
```
