'use strict';

// modeled after the code here https://github.com/firebase/assistant-codelab
// and tutorial here https://codelabs.developers.google.com/codelabs/assistant-codelab/index.html?index=..%2F..%2Findex#0

// this is also helpful - https://developers.google.com/actions/dialogflow/fulfillment

// Debug, only turn this on if you want ALL the debug messages
// process.env.DEBUG = 'actions-on-google:*';

const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const functions = require('firebase-functions'); // Firebase Cloud Functions
const admin = require('firebase-admin'); // Firebase Admin

admin.initializeApp(functions.config().firebase); // init firebase app

var db = admin.firestore(); // Database access using firestore

// DIALOGFLOW INTENT NAMES
// Welcome and fallback
const WELCOME_INTENT = 'input.welcome';
const DEFAULT_FALL_BACK_INTENT = 'input.unknown';

// Locations
const LOCATION_ADD = 'location.add';
const LOCATION_LIST = 'location.list';
const LOCATION_REMOVE = 'location.remove';
const LOCATION_UPDATE = 'location.update';

// Items
const ITEM_ADD = 'item.add';
const ITEM_LIST = 'item.list';
const ITEM_REMOVE = 'item.remove';
const ITEM_UPDATE = 'item.update';

// Expiration
const EXPIRATION_ADD = 'expiration.add';
const EXPIRATION_LIST = 'expiration.list';
const EXPIRATION_REMOVE = 'expiration.remove';
const EXPIRATION_UPDATE = 'expiration.update';

// Cart / Shopping List 
const CART_ADD = 'cart.add';
const CART_LIST = 'cart.list';
const CART_REMOVE = 'cart.remove';
const CART_UPDATE = 'cart.update';
const CART_PURCHASE = 'cart.purchase';

// DIALOGFLOW CONTEXTS
const ADD_CONTEXT = 'add';
const LIST_CONTEXT = 'list';
const REMOVE_CONTEXT = 'remove';
const UPDATE_CONTEXT = 'update';
const PURCHASE_CONTEXT = 'purchase';

// DIALOGFLOW CONTEXT PARAMETERS (parameter --> value)
const LOCATION_CONTEXT = 'locations';
const ITEM_CONTEXT = 'items';

const EXPIRATION_CONTEXT = 'expire';
const DATE_CONTEXT = 'date';

const CART_CONTEXT = 'cart';

// Update context (same as above)
const LOCATION_TO_UPDATE = 'locationToUpdate';
const ITEM_TO_UPDATE = 'itemToUpdate';
const ITEM_IN_CART_TO_UPDATE = 'cartItemToUpdate';

// Permission stuff
const REQUEST_PERMISSION_ACTION = 'permissions.request';
const SAY_NAME_ACTION = 'permissions.sayname';

// TODO: Create multiple cloud functions for each one of these functions? Or at least structure project properly
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    const assistant = new DialogflowApp({ request: request, response: response });

    // Map intents to functions to handle them
    let actionMap = new Map();

    // Welcome and fallback intents 
    actionMap.set(WELCOME_INTENT, welcome);
    actionMap.set(DEFAULT_FALL_BACK_INTENT, defaultFallback);

    // Locations
    actionMap.set(LOCATION_ADD, add);
    actionMap.set(LOCATION_LIST, list);
    actionMap.set(LOCATION_REMOVE, remove);
    actionMap.set(LOCATION_UPDATE, update);

    // Items
    actionMap.set(ITEM_ADD, add);
    actionMap.set(ITEM_LIST, list);
    actionMap.set(ITEM_REMOVE, remove);
    actionMap.set(ITEM_UPDATE, update);

    // Expiration Dates
    actionMap.set(EXPIRATION_ADD, add);
    actionMap.set(EXPIRATION_LIST, list);
    actionMap.set(EXPIRATION_REMOVE, remove);
    actionMap.set(EXPIRATION_UPDATE, update);

    // Cart 
    actionMap.set(CART_ADD, add);
    actionMap.set(CART_LIST, list);
    actionMap.set(CART_REMOVE, remove);
    actionMap.set(CART_UPDATE, update);
    actionMap.set(CART_PURCHASE, purchase);

    // Permissions
    actionMap.set(REQUEST_PERMISSION_ACTION, requestPermission);
    actionMap.set(SAY_NAME_ACTION, sayName);
    
    assistant.handleRequest(actionMap);

    /*******************/
    /* BEGIN FUNCTIONS */
    /*******************/

    function testUserDisplays () {
        console.log('Your USER ID is: ' + assistant.getUser().userId);
        console.log('Your name is: ' + assistant.getUserName().displayName);
    }

    /**
     * Request permission to get access to your name and id. Access by saying "login"
     * @param {*} assistant 
     */
    function requestPermission(assistant) {
        console.log('CALLING REQUEST PERMISSION');
        assistant.setContext(REQUEST_PERMISSION_ACTION);

        const permission = assistant.SupportedPermissions.NAME;
        assistant.askForPermission('[WEBHOOK] To know who you are', permission);
    }

    /**
     * Say the name of the user once they have asked permission. Access by saying "what is my name"
     * @param {*} assistant 
     */
    function sayName(assistant) {
        console.log("TRYING TO SAY NAME");
        assistant.setContext(SAY_NAME_ACTION);

        // User granted permission
        if (assistant.isPermissionGranted()) {
          assistant.ask('Your name is ' + assistant.getUserName().displayName);
          console.log('Trying to get user ID' + assistant.getUser().userId);
        } 

        // Response shows that user did not grant permission
        else {
          assistant.ask('[WEBHOOK] Sorry, I could not get your name. You need to sign in before using the app. Trying saying "login".');
        }
    }

    /**
     * Handle the welcome intent
     * @param {*} assistant 
     */
    function welcome(assistant) {
        console.log('CALLING REQUEST PERMISSION');
        assistant.setContext(REQUEST_PERMISSION_ACTION);

        const permission = assistant.SupportedPermissions.NAME;
        assistant.askForPermission('[WEBHOOK] Welcome to Kitchen Assist. In order to use this app we need to know who you are', permission);

        // assistant.askForSignIn(); // TODO - oAuth once we have it. then add a function like:

        // function signInHandler (app) {
        //     if (app.getSignInStatus() === app.SignInStatus.OK) {
        //       let accessToken = app.getUser().accessToken;
        //       // access account data with token
        //     } else {
        //       app.tell('You need to sign-in before using the app.');
        //     }
        //   }
    }

    /**
     * Handle fallback if the user says something that is unknown
     * @param {*} assistant 
     */
    function defaultFallback(assistant) {
        assistant.ask("[WEBHOOK] Oops, sorry. I didn't get that."); // Ask user something
    }

    /**
     * Add a location, item, expiration date, or something to your cart
     * @param {*} assistant 
     */
    function add(assistant) {

        // Query is currently
        // /locations/<location-name>/items/<item-name>/json-data (expiration)
        
        // NEED TO CHANGE TO and denormalize and account for redundancy
        // /locations/<location-name>
        // /items/<item-name>
        // /cart/

        const intent = assistant.getIntent(); // get the intent given by the user
        console.log('The user said: ' + assistant.getRawInput()); // Get what the user said 

        // Set context
        console.log("setting add context");
        assistant.setContext(ADD_CONTEXT);

         // extract the parameter values - parameter --> value
        const item = assistant.getArgument(ITEM_CONTEXT);
        const location = assistant.getArgument(LOCATION_CONTEXT); // locations --> fridge
        const expiration = assistant.getArgument(DATE_CONTEXT);

        // SWITCH (The intent from the user)
        switch (intent) {
            case LOCATION_ADD:
                console.log("adding location and setting location context");
                assistant.setContext(LOCATION_CONTEXT);

                // console.log(JSON.stringify(assistant.getContext(LOCATION_CONTEXT).parameters, null, 4)); // for debugging
                
                // Query for adding location (can probably break this up more)
                // eventually can use the actual ID here we get when we authenticate
                var addLocationQuery = db.collection('users')
                                         .doc('JESSE_HARDCODE_TEST_ID')
                                         .collection('locations')
                                         .doc(location.toString());
                            
                var addLocationIfItDoesNotExist = addLocationQuery.get()
                    .then(doc => {
                        // IF(The document doesnt exist, add it to the locations in the database)
                        if (!doc.exists) {
                            console.log(`No such document, adding '${location}' to list of locations.`);
                            assistant.ask(`[WEBHOOK] Okay, I will add ${location} to your list of locations.`); // Tell user location has been added
                            addLocationQuery.set({}); // add to database (this works)
                        } 
                        // ELSE(The location exists, tell the user that it exists)
                        else {
                            console.log(`Oops! '${location}' exists in your list of locations. Data:`, doc.data());
                            assistant.ask(`[WEBHOOK] Oops! ${location} already exists in your list of locations.`); // tell user that the location already exists
                        }
                    })
                    // Catch any errors
                    .catch(err => {
                        console.log('Error getting document', err);
                    });
                break;

            case ITEM_ADD:
                console.log("adding item and setting item context");
                assistant.setContext(ITEM_CONTEXT);

                console.log(`Item to add ${item}; Location to add: ${location}`);

                // IF(The user hasn't specified where to store items, ie; 'Add milk', ask them where to store the items )
                if (location == null) {
                    assistant.ask(`[WEBHOOK] Where would you like to store ${item}?`);
                }
                // ELSE (Location is specified where to store items)
                else {
                    // TODO: Modify this query to add items to root level
                    var addItemQuery = db.collection('users')
                                         .doc('JESSE_HARDCODE_TEST_ID')
                                         .collection('locations')
                                         .doc(location.toString())
                                         .collection('items')
                                         .doc(item.toString());

                    // TODO: Need to account for item as a list (array) and add that to the database
                            
                    var addItemIfItDoesNotExistInLocation = addItemQuery.get()
                        .then(doc => {
                            // IF(The document doesnt exist, add it to the locations in the database)
                            if (!doc.exists) {
                                console.log(`No such document, adding '${item}' to '${location}'`);
                                assistant.ask(`[WEBHOOK] Okay, I will add ${item} to your ${location}.`);// Tell user location has been added
                                addItemQuery.set({});
                            } 
                            // ELSE (The item exists in that location, tell the user that it exists)
                            else {
                                console.log(`Oops! '${item}' already exists in your ${location}`);
                                assistant.ask(`[WEBHOOK] Oops! '${item}' already exists in your ${location}`); // tell user that the location already exists
                            }
                        })
                        // Catch any errors
                        .catch(err => {
                            console.log('Error getting document', err);
                    });
                }
                break;

            case EXPIRATION_ADD:
                console.log("adding expiration");
                assistant.setContext(EXPIRATION_CONTEXT); 
                assistant.setContext(ITEM_CONTEXT); // not sure if we need to set these.. still don't really know what setting context does
                assistant.setContext(DATE_CONTEXT); // not sure if we need this either

                console.log(`Expiration to add: ${expiration}; Items to add: ${item}`);

                if(expiration == null && item == null) {
                    assistant.ask(`[WEBHOOK] What item would you like to set to expire?`);
                }
                else if(expiration == null) {
                    assistant.ask(`[WEBHOOK] What expiration date would you like to set on ${item}? Try saying it like MM-DD-YYYY`);
                }
                else if(item == null) {
                    assistant.ask(`[WEBHOOK] What item would you like to set the expiration date of ${expiration}`);
                }
                else if(location == null) {
                    assistant.ask(`[WEBHOOK] Where would you like to set these items to expire?`);
                }
                else {
                    var addExpirationQuery = db.collection('users')
                                            .doc('JESSE_HARDCODE_TEST_ID')
                                            .collection('locations')
                                            .doc(location.toString())
                                            .collection('items')
                                            .doc(item.toString());
                           
                    // TODO: Check if current expiration dates exist? Or just overwrite?
                    var addExpirationDateToItem = addExpirationQuery.get()
                        .then(doc => {
                                assistant.ask(`[WEBHOOK] Okay, I will add an expiration date of ${expiration} to ${item} in your ${location}`);
                                addExpirationQuery.set({
                                    'expiration-date': new Date(expiration)
                                });
                            
                        })
                        // Catch any errors
                        .catch(err => {
                            console.log('Error getting document', err);
                    });
                }

                break;

            case CART_ADD:
                console.log("adding to cart");
                assistant.setContext(CART_CONTEXT);
                assistant.setContext(ITEM_CONTEXT);

                var addToCartQuery = db.collection('users')
                                       .doc('JESSE_HARDCODE_TEST_ID')
                                       .collection('cart')
                                       .doc(item.toString());
                   
                // TODO: Check if something in the cart exists & update query eventually
                var addItemToCart = addToCartQuery.get()
                    .then(doc => {
                            assistant.ask(`[WEBHOOK] Okay, I will add ${item} to your cart.`);
                            addToCartQuery.set({});
                    })
                    // Catch any errors
                    .catch(err => {
                        console.log('Error getting document', err);
                });

                break;

            default:
                assistant.ask('Hmm, I was not able to add that expiration date. Can you try something like, set item to expire in 2 weeks?');
                break;
        }
    }

    /**
     * List your locations, items, expiration dates, or items in your cart
     * @param {*} assistant 
     */
    function list(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        console.log("list");

        assistant.setContext(LIST_CONTEXT); // set list context

        const item = assistant.getArgument(ITEM_CONTEXT);
        const location = assistant.getArgument(LOCATION_CONTEXT); // locations --> fridge
        const expiration = assistant.getArgument(DATE_CONTEXT);

        switch (intent) {
            case LOCATION_LIST:
                console.log("listing locations and setting context");
                assistant.setContext(LOCATION_CONTEXT);

                // TODO: Make database call to get all the stored database locations

                var listLocationQuery = db.collection('users')
                                            .doc('JESSE_HARDCODE_TEST_ID')
                                            .collection('locations');

                var listAllLocations = listLocationQuery.get()
                    .then(snapshot => {
                        var listOfLocations = [];
                        snapshot.forEach(doc => {
                            console.log('Pushing to array: ' + doc.id, '=>', doc.data());
                            listOfLocations.push(doc.id);
                        });
                        assistant.ask(`[WEBHOOK] The locations that you have are ${listOfLocations}.`);
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                    });

                break;
            
            case ITEM_LIST:
                console.log("listing items and setting context");
                assistant.setContext(ITEM_CONTEXT);

                if(location == null) {
                    assistant.ask('Which location should I list your items?');
                }
                else {
                    // TODO: Make database call to get all the items in the given location and list the expiration dates on the items if they have one
                    assistant.ask(`[WEBHOOK] The items that are in your ${location} are: <DB_CALL>`);
                }

                break;

            case EXPIRATION_LIST:
                console.log("listing expiration dates and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);

                assistant.ask('[WEBHOOK] The expiration dates that you have are <DB_CALL FOR ALL EXPIRATION DATES IN ALL LOCATIONS>');
                break;

            case CART_LIST:
                console.log("listing cart and setting context");
                assistant.setContext(CART_CONTEXT);

                assistant.ask('[WEBBOOK] The items that are in your cart are <DB_CALL>');
                break;

            default:
                assistant.ask('Hmm, I was not able to list that. Can you try again?');
                break;
        }
    }

    /**
     * Remove a location, item, expiration date, or item in your cart
     * @param {*} assistant 
     */
    function remove(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        console.log("remove");

        assistant.setContext(REMOVE_CONTEXT);

        switch (intent) {
            case LOCATION_REMOVE:
                console.log("removing location and setting context");
                assistant.setContext(LOCATION_CONTEXT);

                const locationToRemove = assistant.getArgument(LOCATION_CONTEXT);

                // IF (The location does not exist)
                    // Tell user location does not exist
                
                // ELSE (location exists)
                    // Tell user location has been deleted
                    assistant.ask(`[WEBHOOK] I will remove ${locationToRemove} from your list of locations.`);
                    // Query to delete item from DB

                break;
            
            case ITEM_REMOVE:
                console.log("removing item and setting context");
                assistant.setContext(ITEM_CONTEXT);

                const locationWithItemToRemove = assistant.getArgument(LOCATION_CONTEXT);
                const itemToRemove = assistant.getArgument(ITEM_CONTEXT);

                if(locationWithItemToRemove == null) {
                    assistant.ask(`[WEBHOOK] Which location should I remove ${itemToRemove} from?`);
                }
                else {
                    // IF (The item in specific location does not exist)
                        // Tell user the item in the location does not exist
                    // ELSE (location exists)
                        // Tell user location has been deleted
                        assistant.ask(`[WEBHOOK] I will remove ${itemToRemove} from your ${locationWithItemToRemove}.`);
                        // Query to delete item from database
                }

                break;

            case EXPIRATION_REMOVE:
                console.log("removing expiration and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);

                const locationWithItemToRemoveExpirationDate = assistant.getArgument(LOCATION_CONTEXT);
                const itemToRemoveExpirationDate = assistant.getArgument(ITEM_CONTEXT);

                if(locationWithItemToRemoveExpirationDate == null) {
                    assistant.ask(`[WEBHOOK] Which location should I remove the expiration date of ${itemToRemoveExpirationDate} from?`);
                }
                else {
                    // IF (The item in specific location does not exist)
                        // Tell user the item in the location does not exist and there is no expiration date to remove
                    // ELSE (location exists)
                        // Tell user location has been deleted
                        assistant.ask(`[WEBHOOK] I will remove the expiration date of ${itemToRemoveExpirationDate} from your ${locationWithItemToRemoveExpirationDate}.`);
                        // Query to delete item from database
                }

                break;

            case CART_REMOVE:
                console.log("removing from cart and setting context");
                assistant.setContext(CART_CONTEXT);

                const itemToRemoveFromCart = assistant.getArgument(ITEM_CONTEXT);

                // IF (The item in specific does not exist in the cart)
                    // Tell user the item in the location does not exist
                // ELSE (item in cart exists)
                    // Tell user item in cart has been removed
                    assistant.ask(`[WEBHOOK] I will remove ${itemToRemoveFromCart} from your cart.`);
                    // Query to delete item from database in cart
                break;
                
            default:
                assistant.ask('Hmm, I was not able to remove that. Can you try again?');
                break;
        }
    }

    /**
     * Update a location, item, expiration date, or item in your cart
     * @param {*} assistant 
     */    
    function update(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        console.log("update");

        assistant.setContext(UPDATE_CONTEXT);

        switch (intent) {
            case LOCATION_UPDATE:
                console.log("updating location and setting context");
                assistant.setContext(LOCATION_CONTEXT);

                const locationToUpdate = assistant.getArgument(LOCATION_CONTEXT);
                const locationToUpdateTo = assistant.getArgument(LOCATION_TO_UPDATE);

                if(locationToUpdateTo == null) {
                    assistant.ask(`[WEBHOOK] What should I update the name of ${locationToUpdate} to?`);
                }
                else {
                    // TODO
                    // IF (The location doesn't exist)
                        // Tell user location doesn't exist, and ask if they would like to add it.
                    // ELSE (location exists)
                        // Tell user the location's name has been updated
                        assistant.ask(`[WEBHOOK] Okay, I will update your ${locationToUpdate} to ${locationToUpdateTo}.`);
                        // Query to update database
                }
                break;
            
            case ITEM_UPDATE:
                console.log("updating item and setting context");
                assistant.setContext(ITEM_CONTEXT);

                const locationToUpdateItem = assistant.getArgument(LOCATION_CONTEXT);
                const itemToUpdate = assistant.getArgument(ITEM_CONTEXT);
                const itemToUpdateTo = assistant.getArgument(ITEM_TO_UPDATE);

                if(itemToUpdateTo == null) {
                    assistant.ask(`[WEBHOOK] What should I update the name of ${itemToUpdate} to?`);
                }
                else if (locationToUpdateItem == null) {
                    assistant.ask(`[WEBHOOK] What location should I update ${itemToUpdate} from?`);
                }
                else {
                    // TODO
                    // IF (The location doesn't exist)
                        // Tell user location doesn't exist, and ask if they would like to add it.
                    // ELSE (location exists)
                        // Tell user the location's name has been updated
                        assistant.ask(`[WEBHOOK] Okay, I will update your ${itemToUpdate} to ${itemToUpdateTo} in your ${locationToUpdateItem}.`);
                        // Query to update database
                }
                break;

            case EXPIRATION_UPDATE:
                console.log("updating expiration date and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                assistant.setContext(ITEM_CONTEXT); // not sure if we need to set these.. still don't really know what setting context does
                assistant.setContext(DATE_CONTEXT); // not sure if we need this either

                const expirationDateToUpdate = assistant.getArgument(DATE_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge
                const itemsToUpdateToExpiration = assistant.getArgument(ITEM_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge

                console.log(`Expiration to add: ${expirationDateToUpdate}; Items to add: ${itemsToUpdateToExpiration}`);

                if(expirationDateToUpdate == null && itemsToUpdateToExpiration == null) {
                    assistant.ask(`[WEBHOOK] What item would you like to update expiration?`);
                }
                else if(expirationDateToUpdate == null) {
                    assistant.ask(`[WEBHOOK] What expiration date would you like to update on ${itemsToUpdateToExpiration}? Try saying it like MM-DD-YYYY`);
                }
                else if(itemsToUpdateToExpiration == null) {
                    assistant.ask(`[WEBHOOK] What item would you like to update the expiration date of ${expirationDateToUpdate}`);
                }
                else {
                    assistant.ask(`[WEBHOOK] Okay, I will update the expiration date of ${expirationDateToUpdate} to ${itemsToUpdateToExpiration}`);
                }

                break;

            case CART_UPDATE:
                console.log("updating cart and setting context");
                assistant.setContext(CART_CONTEXT);

                const itemToUpdateInCart = assistant.getArgument(ITEM_CONTEXT);
                const itemToUpdateInCartTo = assistant.getArgument(ITEM_IN_CART_TO_UPDATE);

                if(itemToUpdateInCart == null) {
                    assistant.ask(`[WEBHOOK] What should I update your cart item to?`);
                }
                else if (itemToUpdateInCartTo == null) {
                    assistant.ask(`[WEBHOOK] What should I update the name of ${itemToUpdateInCart} in your cart to?`);
                }
                else {
                    // TODO
                    // IF (The location doesn't exist)
                        // Tell user location doesn't exist, and ask if they would like to add it.
                    // ELSE (location exists)
                        // Tell user the location's name has been updated
                        assistant.ask(`[WEBHOOK] Okay, I will update ${itemToUpdateInCart} to ${itemToUpdateInCartTo} in your cart.`);
                        // Query to update database
                }
                break;

            default:
                assistant.ask('Hmm, I was not able to update that. Can you try again?');
                break;
        }
    }

    /**
     * Purchase items in your cart
     * @param {*} assistant 
     */
    function purchase(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        console.log("purchase");

        assistant.setContext(PURCHASE_CONTEXT);

        // TODO @ Zach: Connect to Google Transactions API
        
        assistant.ask('I see you want to purchase something. This is not implemented yet. ');
    }

});

// Handle new user auth events
// Thanks to https://www.youtube.com/watch?v=pADTJA3BoxE&t=187s
exports.createUserAccount = functions.auth.user().onCreate(event => {
    
    // get values from when user signed in through oauth
    const uid = event.data.uid;
    const email = event.data.email; // some users might not have an email

    const userDoc = db.collection('users').doc(uid);

    // set name and email in the db
    return userDoc.set({
        email: email
    })
});

// When a user is deleted, set flag in the db
// Thanks to https://www.youtube.com/watch?v=pADTJA3BoxE&t=187s
exports.cleanUpUserData = functions.auth.user().onDelete(event => {
    
    // get values from when user signed in through oauth
    const uid = event.data.uid;
    const userDoc = db.collection('users').doc(uid);

    // set isDeleted flag in the database when a user deletes their account
    return userDoc.update({
        isDeleted: true
    })
});