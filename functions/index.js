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
const WELCOME_INTENT = 'input.welcome';
const DEFAULT_FALL_BACK_INTENT = 'input.unknown';
const LOCATION_ADD = 'location.add';

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
    actionMap.set(WELCOME_INTENT, welcome);
    actionMap.set(DEFAULT_FALL_BACK_INTENT, defaultFallback);
    actionMap.set(LOCATION_ADD, add);
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

        // Output to firebase console
        // console.log(text);

        // Output to DialogFlow / user
        const speech = text;

        // Ask user something
        assistant.ask(speech);
    }

    // Handle the intent
    function defaultFallback(assistant) {
        const text = "Default fallback! If you are seeing this, that means our own code is working and you are calling the default fallback function. Hooray!";

        // Output to firebase console
        // console.log(text);

        // Output to DialogFlow / user
        const speech = text;

        // Ask user something
        assistant.ask(speech);
    }

    function add(assistant) {
        
        // CASE ITEM
        
        // CASE LOCATION

        // CASE CART / GROCERY LIST

        // CASE EXPIRATION

        const text = "Adding location from webhook!";

        const speech = text;

        assistant.ask(speech);
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