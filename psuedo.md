# Psuedo for project

```javascript
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    // TODO: Update all these itents in DialogFlow too

    // INTENT - Add location
        // IF (The location doesn't exist)
            // Speak back to the user and tell them the location has been added
            // Add location to the DB
        // ELSE (location exists)
            // Tell user location exists

    // INTENT - Update location
        // IF (The location doesn't exists)
            // Tell user location doesn't exist, and if they would like to add it.
        // ELSE (location exists)
            // Speak back to the user and tell them the location has been updated
            // Update DB

    // INTENT - Delete location
        // IF (The location doesn't exists)
            // Tell user location doesn't exist.
        // ELSE (location exists)
            // Speak back to the user and tell them the location has been delete
            // Delete item from DB

    // INTENT - Add item
        // IF (item doesnt exist in a location)
            // Speak back to the user and tell them the item has been updated
            // Add item to DB
            // Make API call on a function to add other traits on the item
    // INTENT - Update item
    // INTENT - Delete item

    // INTENT - Add item to cart
    // INTENT - Update item in cart
    // INTENT - Delete item from cart
    // INTENT - Purchase items in cart

    // INTENT - Add expiration date
    // INTENT - Update expiration date
    // INTENT - Remove expiration date
}

// Not sure if we need this... we would be listening for a bunch of different paths and have lots of cloud functions
// Do this same thing for all other functions (add, update, and delete for location, item, cart, and expiration)
exports.itemAddedToDB = functions.database/ref('/locations/{location}/items/{item-id}') {
    .onWrite( event => {
        // Listen for whenever an item gets added to the DB, and have the assistant speak it to the user.
        // Return promises for each case. 
    });
}

// AUTH - TODO - GET FROM TUTORIAL TO ADD TO DB AND TEST ADDING USERS 
exports.addUserToDatabaseWithAuth = functions.database/ref('/users/{user-id') {
    .onWrite( event => {
        // TODO
    });
}
```