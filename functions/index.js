'use strict';

// Debug, only turn this on if you want ALL the debug messages
// process.env.DEBUG = 'actions-on-google:*';

// Google Assistant helper library
const DialogflowApp = require('actions-on-google').DialogflowApp;

// Cloud Functions for Firebase library
const functions = require('firebase-functions');

// Firebase Admin
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Dialogflow Intent Names
const WELCOME_INTENT = 'input.welcome';
const DEFAULT_FALL_BACK_INTENT = 'input.unknown';

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
    assistant.handleRequest(actionMap);

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
});