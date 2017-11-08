# api

# Cloning the repo
`git clone https://github.com/kitchen-assistant/api.git`

# Deploying Fufillment (Firebase)
Go [here](https://developers.google.com/actions/dialogflow/deploy-fulfillment) for a guide.

`npm install -g firebase-tools`

`firebase login`

`cd api/functions`

`firebase list`

`firebase use <PROJECT_ID>`

`cd api/functions`

`npm install`

`firebase deploy --only functions`

# Stack
- [DialogFlow for Intents and  Entities](https://dialogflow.com/)
- [Storage - Firebase RealTime Database](https://firebase.google.com/products/realtime-database/)
- [Firebase Cloud Functions for Server-side](https://firebase.google.com/docs/functions/)
- Javascript / nodejs

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