# api

# Required Software Installed
- [Git](https://git-scm.com/downloads)
- [Nodejs](https://nodejs.org/en/download/)

# Cloning the git repo
`git clone https://github.com/kitchen-assistant/api.git`

# Deploying Fufillment (Firebase Cloud Functions)

## Deploying the First Time
[This guide](https://codelabs.developers.google.com/codelabs/assistant-codelab/index.html?index=..%2F..%2Findex#5) is the one I followed. [There's also one here.](https://developers.google.com/actions/dialogflow/deploy-fulfillment)

`node --version`

`firebase --version`

`mkdir testing-fufillment`

`cd testing-fufillment`

`firebase login`

`firebase init`

1. Only select the `Functions: COnfigure and deploy Cloud functions` item with the **spacebar**, then hit enter.
2. Select the `kitchen-assist` project. 
3. Follow the rest of the prompts.
4. A `/functions` folder should be created with a boilerplate `index.js` file within it along with some config files.

`cd functions`

`npm install`

`firebase deploy --only functions` or you can do `firebase deploy`

The CLI should print a message to the terminal with the URL of the endpoint where the function will respond and the console.

In our case, they are: 

`https://console.firebase.google.com/project/kitchen-assistant-8b1db/overview`

`https://us-central1-kitchen-assistant-8b1db.cloudfunctions.net/dialogflowFirebaseFulfillment`

Now go to `DialogFlow` --> `Fufillment` --> `Webhook` --> update the URL to the above endpoint.

Now we just have to run `firebase deploy --only functions` from now on.

Note that in our case, we didn't actually get an endpoint through the CLI because we deployed it using the inline editor and continued to use that endpoint.

## Deploying after cloning this repo for the first time
I'm still not sure the best way to do this. When setting up the project, it's probably best for Firebase to generate the `/functions` and `index.js`. 

You should run all the above commands to get a clean install and deployment for Firebase. Then, copy whatever code you need from the git repo to it, then paste it back when you're done. But I don't think that's right.

# Stack
- [Google Assistant / Google Home - Actions on Google](https://developers.google.com/actions/)
- [DialogFlow for Intents and Entities](https://dialogflow.com/)
- [Storage - Firebase RealTime Database](https://firebase.google.com/products/realtime-database/)
- [Server - Firebase Cloud Functions](https://firebase.google.com/docs/functions/)
- Language - Javascript / nodejs

# Work Management and Issue Tracking
- [Github](https://github.com/kitchen-assistant)
- [Zenhub](https://app.zenhub.com/workspace/o/kitchen-assistant/api/boards?repos=109394210,109394179,109862493,109733527)

# Console Portals
You'll need to contact Jesse to add you to these portals.

- [DialogFlow Console](https://console.dialogflow.com/api-client/#/login)
- [Actions on Google Console](https://console.actions.google.com/u/0/project/kitchen-assistant-8b1db/overview)
- [Firebase Console - Functions](https://console.firebase.google.com/u/0/project/kitchen-assistant-8b1db/functions/list)
- [Firebase Console - Realtime Database](https://console.firebase.google.com/u/0/project/kitchen-assistant-8b1db/database/data)

# Communication 
- [The #kitchen-assist channel on Hack Upstate's Slack](http://huslack.herokuapp.com/)

# Helpful tools
- [FireBase Admin - Visualize Database. Similar to MongoDB Compass](https://firebaseadmin.com/)

Follow the instructions [here to get setup](http://docs.codefoxes.com/firebase-admin/).