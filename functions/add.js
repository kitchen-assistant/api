// /**
//  * Add a location, item, expiration date, or something to your cart
//  * @param {*} assistant 
//  */
// function add(assistant) {

//     // Query is currently
//     // /locations/<location-name>/items/<item-name>/json-data (expiration)

//     // NEED TO CHANGE TO and denormalize and account for redundancy
//     // /locations/<location-name>
//     // /items/<item-name>
//     // /cart/

//     const intent = assistant.getIntent(); // get the intent given by the user
//     console.log('The user said: ' + assistant.getRawInput()); // Get what the user said 

//     // Set context
//     console.log("setting add context");
//     assistant.setContext(ADD_CONTEXT);

//     // extract the parameter values - parameter --> value
//     const item = assistant.getArgument(ITEM_CONTEXT);
//     const location = assistant.getArgument(LOCATION_CONTEXT); // locations --> fridge
//     const expiration = assistant.getArgument(DATE_CONTEXT);

//     // SWITCH (The intent from the user)
//     switch (intent) {
//         case Intents.LOCATION_ADD:
//             console.log("adding location and setting location context");
//             assistant.setContext(LOCATION_CONTEXT);

//             // console.log(JSON.stringify(assistant.getContext(LOCATION_CONTEXT).parameters, null, 4)); // for debugging

//             // Query for adding location (can probably break this up more)
//             // eventually can use the actual ID here we get when we authenticate
//             var addLocationQuery = db.collection('users')
//                 .doc('JESSE_HARDCODE_TEST_ID')
//                 .collection('locations')
//                 .doc(location.toString());

//             var addLocationIfItDoesNotExist = addLocationQuery.get()
//                 .then(doc => {
//                     // IF(The document doesnt exist, add it to the locations in the database)
//                     if (!doc.exists) {
//                         console.log(`No such document, adding '${location}' to list of locations.`);
//                         assistant.ask(`[WEBHOOK] Okay, I will add ${location} to your list of locations.`); // Tell user location has been added
//                         addLocationQuery.set({}); // add to database (this works)
//                     }
//                     // ELSE(The location exists, tell the user that it exists)
//                     else {
//                         console.log(`Oops! '${location}' exists in your list of locations. Data:`, doc.data());
//                         assistant.ask(`[WEBHOOK] Oops! ${location} already exists in your list of locations.`); // tell user that the location already exists
//                     }
//                 })
//                 // Catch any errors
//                 .catch(err => {
//                     console.log('Error getting document', err);
//                 });
//             break;

//         case Intents.ITEM_ADD:
//             console.log("adding item and setting item context");
//             assistant.setContext(ITEM_CONTEXT);

//             console.log(`Item to add ${item}; Location to add: ${location}`);

//             // IF(The user hasn't specified where to store items, ie; 'Add milk', ask them where to store the items )
//             if (location == null) {
//                 assistant.ask(`[WEBHOOK] Where would you like to store ${item}?`);
//             }
//             // ELSE (Location is specified where to store items)
//             else {
//                 // TODO: Modify this query to add items to root level
//                 var addItemQuery = db.collection('users')
//                     .doc('JESSE_HARDCODE_TEST_ID')
//                     .collection('locations')
//                     .doc(location.toString())
//                     .collection('items')
//                     .doc(item.toString());

//                 // TODO: Need to account for item as a list (array) and add that to the database

//                 var addItemIfItDoesNotExistInLocation = addItemQuery.get()
//                     .then(doc => {
//                         // IF(The document doesnt exist, add it to the locations in the database)
//                         if (!doc.exists) {
//                             console.log(`No such document, adding '${item}' to '${location}'`);
//                             assistant.ask(`[WEBHOOK] Okay, I will add ${item} to your ${location}.`);// Tell user location has been added
//                             addItemQuery.set({});
//                         }
//                         // ELSE (The item exists in that location, tell the user that it exists)
//                         else {
//                             console.log(`Oops! '${item}' already exists in your ${location}`);
//                             assistant.ask(`[WEBHOOK] Oops! '${item}' already exists in your ${location}`); // tell user that the location already exists
//                         }
//                     })
//                     // Catch any errors
//                     .catch(err => {
//                         console.log('Error getting document', err);
//                     });
//             }
//             break;

//         case Intents.EXPIRATION_ADD:
//             console.log("adding expiration");
//             assistant.setContext(EXPIRATION_CONTEXT);
//             assistant.setContext(ITEM_CONTEXT); // not sure if we need to set these.. still don't really know what setting context does
//             assistant.setContext(DATE_CONTEXT); // not sure if we need this either

//             console.log(`Expiration to add: ${expiration}; Items to add: ${item}`);

//             if (expiration == null && item == null) {
//                 assistant.ask(`[WEBHOOK] What item would you like to set to expire?`);
//             }
//             else if (expiration == null) {
//                 assistant.ask(`[WEBHOOK] What expiration date would you like to set on ${item}? Try saying it like MM-DD-YYYY`);
//             }
//             else if (item == null) {
//                 assistant.ask(`[WEBHOOK] What item would you like to set the expiration date of ${expiration}`);
//             }
//             else if (location == null) {
//                 assistant.ask(`[WEBHOOK] Where would you like to set these items to expire?`);
//             }
//             else {
//                 var addExpirationQuery = db.collection('users')
//                     .doc('JESSE_HARDCODE_TEST_ID')
//                     .collection('locations')
//                     .doc(location.toString())
//                     .collection('items')
//                     .doc(item.toString());

//                 // TODO: Check if current expiration dates exist? Or just overwrite?

//                 // Query to add expiration to /locations/<location-name>/items/<item-name>/expiration-date: <date>
//                 var addExpirationDateToItemInLocations = addExpirationQuery.get()
//                     .then(doc => {
//                         assistant.ask(`[WEBHOOK] Okay, I will add an expiration date of ${expiration} to ${item} in your ${location}`);
//                         addExpirationQuery.set({
//                             'expiration-date': new Date(expiration)
//                         });
//                     })
//                     // Catch any errors
//                     .catch(err => {
//                         console.log('Error getting document', err);
//                     });

//                 // Query to add to root level /expiration/expiration-date: <date>
//                 var addExpirationQueryToRoot = db.collection('users')
//                     .doc('JESSE_HARDCODE_TEST_ID')
//                     .collection('expiration')
//                     .doc(item.toString());

//                 var addExpirationToRoot = addExpirationQueryToRoot.get()
//                     .then(doc => {
//                         addExpirationQueryToRoot.set({
//                             'expiration-date': new Date(expiration)
//                         })
//                     })
//                     // Catch any errors
//                     .catch(err => {
//                         console.log('Error getting document', err);
//                     });
//             }

//             break;

//         case Intents.CART_ADD:
//             console.log("adding to cart");
//             assistant.setContext(CART_CONTEXT);
//             assistant.setContext(ITEM_CONTEXT);

//             var addToCartQuery = db.collection('users')
//                 .doc('JESSE_HARDCODE_TEST_ID')
//                 .collection('cart')
//                 .doc(item.toString());

//             // TODO: Check if something in the cart exists & update query eventually
//             var addItemToCart = addToCartQuery.get()
//                 .then(doc => {
//                     assistant.ask(`[WEBHOOK] Okay, I will add ${item} to your cart.`);
//                     addToCartQuery.set({});
//                 })
//                 // Catch any errors
//                 .catch(err => {
//                     console.log('Error getting document', err);
//                 });

//             break;

//         default:
//             assistant.ask('Hmm, I was not able to add that expiration date. Can you try something like, set item to expire in 2 weeks?');
//             break;
//     }
// }

// module.exports = add;