import * as functions from 'firebase-functions';


import * as admin from 'firebase-admin';
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateUser = functions.database.ref('/users').onWrite((change:any, context:any)=>{
    if (change.before.exists()) {
        return null;
      }
      // Exit when the data is deleted.
      if (!change.after.exists()) {
        return null;
      }
      // Grab the current value of what was written to the Realtime Database.
      const original = change.after.val();
      console.log('Uppercasing', context.params.pushId, original);
      //@ts-ignore
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return admin.database().ref('/user12314').set(JSON.stringify(change.after.val()))
})
  
