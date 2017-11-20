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
    
    assistant.handleRequest(actionMap);

    function boilerPlateIntentHandler(assistant) {
        // Get the prior question
        // Define parameters
        // Set the context
        // Ask the user something
    }

    /**
     * Handle the welcome intent
     * @param {*} assistant 
     */
    function welcome(assistant) {
        const speech = "Welcome! If you are seeing this, that means our own code is working and you are calling the welcome function. Hooray!";
        assistant.ask(speech); // Ask user something
    }

    /**
     * Handle fallback if the user says something that is unknown
     * @param {*} assistant 
     */
    function defaultFallback(assistant) {
        const speech = "Default fallback! If you are seeing this, that means our own code is working and you are calling the default fallback function. Hooray!";
        assistant.ask(speech); // Ask user something
    }

    /**
     * Add a location, item, expiration date, or something to your cart
     * @param {*} assistant 
     */
    function add(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let speech; // text to be returned to the user
        console.log('The user said: ' + assistant.getRawInput()); // Get what the user said 

        // Set context
        console.log("setting add context");
        assistant.setContext(ADD_CONTEXT);

        // SWITCH (The intent from the user)
        switch (intent) {
            case LOCATION_ADD:
                console.log("adding location and setting location context");
                assistant.setContext(LOCATION_CONTEXT);

                // console.log(JSON.stringify(assistant.getContext(LOCATION_CONTEXT).parameters, null, 4)); // for debugging
                
                const locationToAdd = assistant.getArgument(LOCATION_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge

                // Move below logic outside the switch statement in a exists function?

                // TODO IF (The location doesn't exist)
                    // Tell user location has been added
                    speech = `Okay, I will add ${locationToAdd} to your list of locations.`;

                    // TODO @ ZACH: Query to add to database
                    // TODO: How to get the current user 
                    var userDoc = db.collection('users').doc("2mQJiD8oR2dvyqVJdW4O");

                    // Add the location to the database with nothing in it
                    var addLocationDoc = userDoc.set({
                        locations : {
                            [locationToAdd]: {}
                        }
                    });

                // TODO ELSE (location exists)
                    // TODO Tell user location exists already

                break;

            case ITEM_ADD:
                console.log("adding item and setting item context");
                assistant.setContext(ITEM_CONTEXT);

                const itemsToAdd = assistant.getArgument(ITEM_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge
                const locationToAddWithItem = assistant.getArgument(LOCATION_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge

                console.log(`Item to add ${itemsToAdd}; Location to add: ${locationToAddWithItem}`);

                // IF(The user hasn't specified where to store items, ie; 'Add milk', ask them where to store the items )
                if (locationToAddWithItem == null) {
                    assistant.ask(`[WEBHOOK] Where would you like to store ${itemsToAdd}?`);
                }
                // ELSE (Location is specified where to store items)
                else {
                    speech = `[WEBHOOK] Okay, I will add ${itemsToAdd} to your ${locationToAddWithItem}.`;
                }

                // IF (The item doesn't exist in the location)
                    // Tell user item has been added
                    // TODO @ ZACH: Make API call to populate fields on the item
                    // TODO @ ZACH: Query to add to database
                // ELSE (item exists)
                    // Tell user item exists already
                break;

            case EXPIRATION_ADD:
                console.log("adding expiration");
                assistant.setContext(EXPIRATION_CONTEXT); 
                assistant.setContext(ITEM_CONTEXT); // not sure if we need to set these.. still don't really know what setting context does
                assistant.setContext(DATE_CONTEXT); // not sure if we need this either

                const expirationDateToAdd = assistant.getArgument(DATE_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge
                const itemsToAddToExpiration = assistant.getArgument(ITEM_CONTEXT); // extract the parameter values; i.e. parameter --> value; locations --> fridge

                console.log(`Expiration to add: ${expirationDateToAdd}; Items to add: ${itemsToAddToExpiration}`);

                if(expirationDateToAdd == null && itemsToAddToExpiration == null) {
                    assistant.ask(`[WEBHOOK] What item would you like to set to expire?`);
                }
                else if(expirationDateToAdd == null) {
                    assistant.ask(`[WEBHOOK] What expiration date would you like to set on ${itemsToAddToExpiration}? Try saying it like MM-DD-YYYY`);
                }
                else if(itemsToAddToExpiration == null) {
                    assistant.ask(`[WEBHOOK] What item would you like to set the expiration date of ${expirationDateToAdd}`);
                }
                else {
                    speech = `[WEBHOOK] Okay, I will add an expiration date of ${expirationDateToAdd} to ${itemsToAddToExpiration}`;
                }

                break;

            case CART_ADD:
                console.log("adding to cart");
                assistant.setContext(CART_CONTEXT);
                assistant.setContext(ITEM_CONTEXT);

                const itemToAddToCart = assistant.getArgument(ITEM_CONTEXT);

                console.log(`[WEBHOOK] Okay, I will add ${itemToAddToCart} to your cart.`);
                speech = `[WEBHOOK] Okay, I will add ${itemToAddToCart} to your cart.`;
                break;

            default:
                console.log("adding default");
                speech = 'Hmm, I was not able to add that expiration date. Can you try something like, set item to expire in 2 weeks?';
                break;
        }
        
        assistant.ask(speech); // ask user something
    }

    /**
     * List your locations, items, expiration dates, or items in your cart
     * @param {*} assistant 
     */
    function list(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let speech; // text to be returned to the user
        console.log("list");

        assistant.setContext(LIST_CONTEXT); // set list context

        switch (intent) {
            case LOCATION_LIST:
                console.log("listing locations and setting context");
                assistant.setContext(LOCATION_CONTEXT);
                speech = 'LOCATION_LIST from webook';
                break;
            
            case ITEM_LIST:
                console.log("listing items and setting context");
                assistant.setContext(ITEM_CONTEXT);
                speech = 'ITEM_LIST from webook';
                break;

            case EXPIRATION_LIST:
                console.log("listing expiration dates and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                speech = 'EXPIRATION_LIST from webook';
                break;

            case CART_LIST:
                console.log("listing cart and setting context");
                assistant.setContext(CART_CONTEXT);
                speech = 'CART_LIST from webook';
                break;

            default:
                speech = 'Hmm, I was not able to list that. Can you try again?';
                break;
        }

        assistant.ask(speech); // ask user something
    }

    /**
     * Remove a location, item, expiration date, or item in your cart
     * @param {*} assistant 
     */
    function remove(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let speech; // text to be returned to the user
        console.log("remove");

        assistant.setContext(REMOVE_CONTEXT);

        switch (intent) {
            case LOCATION_REMOVE:
                // IF (The location doesn't exists)
                    // Tell user location doesn't exist to delete
                // ELSE (location exists)
                    // Tell user location has been deleted
                    // TODO @ ZACH: Query to delete item from DB


                console.log("removing location and setting context");
                assistant.setContext(LOCATION_CONTEXT);
                speech = 'LOCATION_REMOVE from webook';
                break;
            
            case ITEM_REMOVE:
                console.log("removing item and setting context");
                assistant.setContext(ITEM_CONTEXT);
                speech = 'ITEM_REMOVE from webook';
                break;

            case EXPIRATION_REMOVE:
                console.log("removing expiration and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                speech = 'EXPIRATION_REMOVE from webook';
                break;

            case CART_REMOVE:
                console.log("removing from cart and setting context");
                assistant.setContext(CART_CONTEXT);
                speech = 'CART_REMOVE from webook';
                break;
                
            default:
                speech = 'Hmm, I was not able to remove that. Can you try again?';
                break;
        }

        assistant.ask(speech); // ask user something
    }

    /**
     * Update a location, item, expiration date, or item in your cart
     * @param {*} assistant 
     */    
    function update(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let speech; // text to be returned to the user
        console.log("update");

        assistant.setContext(UPDATE_CONTEXT);

        switch (intent) {
            case LOCATION_UPDATE:
                // IF (The location doesn't exist)
                    // Tell user location doesn't exist, and ask if they would like to add it.
                // ELSE (location exists)
                    // Tell user the location has been updated
                    // TODO @ ZACH: Query to update database
                console.log("updating location and setting context");
                assistant.setContext(LOCATION_CONTEXT);
                speech = 'LOCATION_UPDATE from webook';
                break;
            
            case ITEM_UPDATE:
                console.log("updating item and setting context");
                assistant.setContext(ITEM_CONTEXT);
                speech = 'ITEM_UPDATE from webook';
                break;

            case EXPIRATION_UPDATE:
                console.log("updating expiration date and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                speech = 'EXPIRATION_UPDATE from webook';
                break;

            case CART_UPDATE:
                console.log("updating cart and setting context");
                assistant.setContext(CART_CONTEXT);
                speech = 'CART_UPDATE from webook';
                break;

            default:
                speech = 'Hmm, I was not able to update that. Can you try again?';
                break;
        }

        assistant.ask(speech); // ask user something
    }

    /**
     * Purchase items in your cart
     * @param {*} assistant 
     */
    function purchase(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let speech; // text to be returned to the user
        console.log("purchase");

        assistant.setContext(PURCHASE_CONTEXT);

        // TODO @ Zach: Connect to Google Transactions API
        
        assistant.ask(speech);
    }

});

// TODO @ JESSE: Update these functions to be consistent with database schema 

// Handle new user auth events
// Thanks to https://www.youtube.com/watch?v=pADTJA3BoxE&t=187s
exports.createUserAccount = functions.auth.user().onCreate(event => {
    
    // get values from when user signed in through oauth
    const uid = event.data.uid;
    const email = event.data.email; // some users might not have an email

    // database ref to path
    const newUserRef = dbref.child(`/users/${uid}`);

    // set name and email in the db
    return newUserRef.set({
        email: email
    })
});

// When a user is deleted, set flag in the db
// Thanks to https://www.youtube.com/watch?v=pADTJA3BoxE&t=187s
exports.cleanUpUserData = functions.auth.user().onDelete(event => {
    
    // get values from when user signed in through oauth
    const uid = event.data.uid;
    const userRef = dbref.child(`/users/${uid}`);

    // set isDeleted flag in the database when a user deletes their account
    return userRef.update({
        isDeleted: true
    })
});