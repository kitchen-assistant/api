# api

# Cloning the repo
`git clone https://github.com/kitchen-assistant/api.git`

# Deploying Fufillment
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
- [DialogFlow for Intents, Entities, and Fufillment](https://dialogflow.com/)
- [Storage - Firebase RealTime Database](https://firebase.google.com/products/realtime-database/)

# Work Management and Issue Tracking
- [Github](https://github.com/kitchen-assistant)
- [Zenhub](https://app.zenhub.com/workspace/o/kitchen-assistant/api/boards?repos=109394210,109394179,109862493,109733527)

# Console Portals (TODO: @JessePeplinski - Add people to portals)
- DialogFlow
- Actions on Google Console
- Firebase (functions and storage)

# Communication 
- [The #kitchen-assist channel on Hack Upstate's Slack](http://huslack.herokuapp.com/)

# Helpful tools
- [FireBase Admin - Visualize Database. Similar to MongoDB Compass](https://firebaseadmin.com/)
Follow the instructions [here to get setup](http://docs.codefoxes.com/firebase-admin/).