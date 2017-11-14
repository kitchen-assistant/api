'use strict';

// modeled after the code here https://github.com/firebase/assistant-codelab
// and tutorial here https://codelabs.developers.google.com/codelabs/assistant-codelab/index.html?index=..%2F..%2Findex#0

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

// Dialogflow Intent Names

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

// Expiration
const EXPIRATION_ADD = 'expiration.add';

// Cart / Shopping List 
const CART_ADD = 'cart.add';

// Contexts
// TODO

// Context Parameters
// TODO

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

    // Expiration Dates
    actionMap.set(EXPIRATION_ADD, add);

    // Cart 
    actionMap.set(CART_ADD, add);
    
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

        // TODO: Logic for these cases
        switch (intent) {
            case LOCATION_ADD:
                text = 'LOCATION_ADD from webook';
                break;

            case ITEM_ADD:
                text = 'ITEM_ADD from webook';
                break;

            case EXPIRATION_ADD:
                text = 'EXPIRATION_ADD from webook';
                break;

            case CART_ADD:
                text = 'CART_ADD from webook';
                break;

            default:
                text = 'Hmm, I was not able to add that. Can you try again?';
                break;
        }
        
        const speech = text; // output to dialogflow
        assistant.ask(speech); // ask user something
    }

    function list(assistant) {
        const intent = assistant.getIntent(); // get the intent given by the user
        let text; // text to be returned to the user

        switch (intent) {
            case LOCATION_LIST:
                text = 'LOCATION_LIST from webook';
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

        switch (intent) {
            case LOCATION_REMOVE:
                text = 'LOCATION_REMOVE from webook';
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

        switch (intent) {
            case LOCATION_UPDATE:
                text = 'LOCATION_UPDATE from webook';
                break;

            default:
                text = 'Hmm, I was not able to update that. Can you try again?';
                break;
        }

        const speech = text; // output to dialogflow
        assistant.ask(speech); // ask user something
    }

});

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