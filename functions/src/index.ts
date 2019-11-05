import * as functions from 'firebase-functions';


import * as admin from 'firebase-admin';
import  {google} from 'googleapis';
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.impersonateMakeUpperCase = functions.database.ref('/users/{userid}').onCreate((snap:any, context:any)=>{
      const jwt = getJwt();
      const apiKey = getApiKey();
      const spreadsheetId = '1LXtYyQh0yp2Bw1CHPo5FJNwAiJTdhPYeeYpQwiPZHOg';
      const range = 'A1';

      


      const date = new Date()
      const row = [`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      , snap.val().displayName, snap.val().weleEmail , snap.val().condition , 
      snap.val().place, snap.val().purpose , snap.val().weleChannel, 
      snap.val().city, snap.val().ad]
      appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
      // Grab the current value of what was written to the Realtime Database.

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return true 
})
  



function getJwt() {
  var credentials = {
    "type": "service_account",
    "project_id": "wele-app",
    "private_key_id": "12fe17108c58f3b94b5598b2b798360068bcd69c",
    "private_key": "<your privatekey>",
    "client_email": "spreadsheet-writer@wele-app.iam.gserviceaccount.com",
    "client_id": "111986663547075587148",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/spreadsheet-writer%40wele-app.iam.gserviceaccount.com"
  }
  return new google.auth.JWT(
    //@ts-ignore
    credentials.client_email, null, credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

function getApiKey() {
  var apiKeyFile = {
    key:"<YOUR API KEY>"
  }
  return apiKeyFile.key;
}

function appendSheetRow(jwt:any, apiKey:any, spreadsheetId: any, range: any, row: any) {
  const sheets = google.sheets({version: 'v4'});
  sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    auth: jwt,
    key: apiKey,
    valueInputOption: 'RAW',
    //@ts-ignore
    resource: {values: [row]}
  }, function(err:any, result:any) {
    if (err) {
      throw err;
    }
    else {
      console.log('Updated sheet: ' + result.data.updates.updatedRange);
    }
  });
}
