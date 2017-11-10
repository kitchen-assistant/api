# Psuedo for project

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    // TODO: Update all these itents in DialogFlow too

    // INTENT - Add location
        // IF(The location doesn't exist)
            // Speak back to the user and tell them the location has been added
            // Add location to the DB
        ELSE (Location exists)
            // Tell user location exists

    // INTENT - Update location
        // Speak back to the user and tell them the location has been added
        // Add location to the DB
    // INTENT - Delete location
    
    // INTENT - Add item
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
exports.itemAddedToDB = functions.database/ref('/locations/{location}/items/{item-id} {
    .onWrite( event => {
        // Listen for whenever an item gets added to the DB, and have the assistant speak it to the user.
        // Return promises for each case. 
    });
}