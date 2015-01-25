# Meteor persistent minimongo

Simple client-side observer class that provides persistence for Meteor Collections using browser storage via Amplify.js. Collections are reactive across browser tabs.

*based on a package by Jeff Mitchel https://github.com/jeffmitchel/meteor-local-persist*

## Installation:
`$ meteor add frozeman:persistent-minimongo`


## Documentation:

### Constructor:

```
new PersistentMinimongo(collection);
```

Collection is the Meteor Collection to be persisted.

### Methods:

```js

var myPersistentColleciton = new PersistentMinimongo(collection);

// Refreshes the collections from localstorage
myPersistentColleciton.refresh()

// Gets the current size of the localstorage in MB
myPersistentColleciton.localStorageSize()

// Will check if the current size of the localstorage is larger then 4.8 MB, if so it will remove the 50 latest entries of the collection.
myPersistentColleciton.capCollection()
```

## Example:

Implement a simple shopping cart as a local collection.

```js
if (Meteor.isClient) {
    // create a local collection, 
    var shoppingCart = new Meteor.Collection('shopping-cart', {connection: null});

    // create a local persistence observer
    var shoppingCartObserver = new PersistentMinimongo(shoppingCart);

    // create a handlebars helper to fetch the data
    Handlebars.registerHelper("shoppingCartItems", function () {
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

## Notes:

- This is a simple implementation that keeps an identical copy of the collection's data in browser storage. While not especially space efficient, it does preserve all of the Meteor.Collection reactive goodness.

- The cross-tab reactvity implementation is naive and will resync all PersistentMinimongo instances when a browser storage event is fired.

- See http://amplifyjs.com/api/store/#storagetypes for information about how data is stored in the browser.
