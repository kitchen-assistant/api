'use strict';

// modeled after the code here https://github.com/firebase/assistant-codelab
// and tutorial here https://codelabs.developers.google.com/codelabs/assistant-codelab/index.html?index=..%2F..%2Findex#0

// this is also helpful - https://developers.google.com/actions/dialogflow/fulfillment

// Debug, only turn this on if you want ALL the debug messages
// process.env.DEBUG = 'actions-on-google:*';

// Google Assistant helper library
const DialogflowApp = require('actions-on-google').DialogflowApp;

// Cloud Functions for Firebase library
const functions = require('firebase-functions');

// Firebase Admin
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Database access
const dbref = admin.database().ref(); // can also specify a path to the db here

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
// TODO
const ADD_CONTEXT = 'add';
const LIST_CONTEXT = 'list';
const REMOVE_CONTEXT = 'remove';
const UPDATE_CONTEXT = 'update';
const PURCHASE_CONTEXT = 'purchase';

const LOCATION_CONTEXT = 'locations';
const ITEM_CONTEXT = 'items';
const EXPIRATION_CONTEXT = 'expire';
const CART_CONTEXT = 'cart';

// DIALOGFLOW CONTEXT PARAMETERS
// TODO

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

    // Handle the welcome intent
    function welcome(assistant) {
        const text = "Welcome! If you are seeing this, that means our own code is working and you are calling the welcome function. Hooray!";
        const speech = text; // Output to DialogFlow
        assistant.ask(speech); // Ask user something
    }

    // Handle the intent
    function defaultFallback(assistant) {
        const text = "Default fallback! If you are seeing this, that means our own code is working and you are calling the default fallback function. Hooray!";
        const speech = text;  // Output to DialogFlow
        assistant.ask(speech); // Ask user something
    }

    function add(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let text; // text to be returned to the user
        console.log("add");

        let userSpeech = assistant.getRawInput(); // Get exactly what the user said 
        console.log('The user said: ' + userSpeech);

        // TODO @ JESSE: Get the actual thing to be added
        // I need to extract the parameter values
        // https://dialogflow.com/docs/actions-and-parameters#original
        // let tryToGetArgument = assistant.getArgument(intent);
        // console.log('Extracting from argument: ' + tryToGetArgument);

        // Set context
        console.log("setting add context");
        assistant.setContext(ADD_CONTEXT);

        // let testContext = assistant.getContext(ADD_CONTEXT);
        // console.log('trying to spit out context...' + testContext);


        switch (intent) {
            case LOCATION_ADD:
                console.log("adding location and setting location context");
                assistant.setContext(LOCATION_CONTEXT);

                // for debugging
                // console.log(JSON.stringify(assistant.getContext(ADD_CONTEXT).parameters, null, 4));

                // for debugging
                // console.log(JSON.stringify(assistant.getContext(LOCATION_CONTEXT).parameters, null, 4));

                // get argument from the context; i.e. parameter --> value; locations --> fridge
                const thingToAdd = assistant.getArgument(LOCATION_CONTEXT);

                console.log("CAN WE GET THE THING TO ADD????? LETS SEE: " + thingToAdd);

                text = 'LOCATION_ADD from webook';

                // TODO: Move below logic outside the switch statement in a exists function
                // IF (The location doesn't exist)
                    // Tell user location has been added
                    // TODO @ ZACH: Query to add to database
                // ELSE (location exists)
                    // Tell user location exists already
                break;

            case ITEM_ADD:
                console.log("adding item and setting item context");
                assistant.setContext(ITEM_CONTEXT);
                text = 'ITEM_ADD from webook';
                // IF (The item doesn't exist)
                    // Tell user item has been added
                    // TODO @ ZACH: Make API call to populate fields on the item
                    // TODO @ ZACH: Query to add to database
                // ELSE (item exists)
                    // Tell user item exists already
                break;

            case EXPIRATION_ADD:
                console.log("adding expiration");
                assistant.setContext(EXPIRATION_CONTEXT);
                text = 'EXPIRATION_ADD from webook';
                break;

            case CART_ADD:
                console.log("adding to cart");
                assistant.setContext(CART_CONTEXT);
                text = 'CART_ADD from webook';
                break;

            default:
                console.log("adding default");
                text = 'Hmm, I was not able to add that. Can you try again?';
                break;
        }
        
        const speech = text; // output to dialogflow
        assistant.ask(speech); // ask user something
    }

    function list(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let text; // text to be returned to the user
        console.log("list");

        assistant.setContext(LIST_CONTEXT); // set list context

        switch (intent) {
            case LOCATION_LIST:
                console.log("listing locations and setting context");
                assistant.setContext(LOCATION_CONTEXT);
                text = 'LOCATION_LIST from webook';
                break;
            
            case ITEM_LIST:
                console.log("listing items and setting context");
                assistant.setContext(ITEM_CONTEXT);
                text = 'ITEM_LIST from webook';
                break;

            case EXPIRATION_LIST:
                console.log("listing expiration dates and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                text = 'EXPIRATION_LIST from webook';
                break;

            case CART_LIST:
                console.log("listing cart and setting context");
                assistant.setContext(CART_CONTEXT);
                text = 'CART_LIST from webook';
                break;

            default:
                text = 'Hmm, I was not able to list that. Can you try again?';
                break;
        }

        const speech = text; // output to dialogflow
        assistant.ask(speech); // ask user something
    }

    function remove(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let text; // text to be returned to the user
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
                text = 'LOCATION_REMOVE from webook';
                break;
            
            case ITEM_REMOVE:
                console.log("removing item and setting context");
                assistant.setContext(ITEM_CONTEXT);
                text = 'ITEM_REMOVE from webook';
                break;

            case EXPIRATION_REMOVE:
                console.log("removing expiration and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                text = 'EXPIRATION_REMOVE from webook';
                break;

            case CART_REMOVE:
                console.log("removing from cart and setting context");
                assistant.setContext(CART_CONTEXT);
                text = 'CART_REMOVE from webook';
                break;
                
            default:
                text = 'Hmm, I was not able to remove that. Can you try again?';
                break;
        }

        const speech = text; // output to dialogflow
        assistant.ask(speech); // ask user something
    }

    function update(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let text; // text to be returned to the user
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
                text = 'LOCATION_UPDATE from webook';
                break;
            
            case ITEM_UPDATE:
                console.log("updating item and setting context");
                assistant.setContext(ITEM_CONTEXT);
                text = 'ITEM_UPDATE from webook';
                break;

            case EXPIRATION_UPDATE:
                console.log("updating expiration date and setting context");
                assistant.setContext(EXPIRATION_CONTEXT);
                text = 'EXPIRATION_UPDATE from webook';
                break;

            case CART_UPDATE:
                console.log("updating cart and setting context");
                assistant.setContext(CART_CONTEXT);
                text = 'CART_UPDATE from webook';
                break;

            default:
                text = 'Hmm, I was not able to update that. Can you try again?';
                break;
        }

        const speech = text; // output to dialogflow
        assistant.ask(speech); // ask user something
    }

    function purchase(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let text; // text to be returned to the user
        console.log("purchase");

        assistant.setContext(PURCHASE_CONTEXT);

        // TODO: Connect to Google Transactions API

        const speech = text;
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