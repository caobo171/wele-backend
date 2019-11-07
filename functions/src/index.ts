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


const getMyResultAsync = (email: string)=>{
    return new Promise((resolve:any, reject:any) => {
      const reConverEmail = email.toString().replace('.', '<dot>').replace('[', '<open>').replace(']', '<close>').replace('#', '<sharp>').replace('$', '<dollar>').replace('.', '<dot>').replace('.', '<dot>').replace('.', '<dot>')
    

      const resultRef = admin.database().ref(`/results/${reConverEmail}`)
  
      resultRef.once('value', (snapshot: any) => {
          resolve(snapshot.val())    
      }).catch(err=> console.log('err', err))
    })
    return email
}


exports.impersonateMakeUpperCase = functions.database.ref('/users/{userid}').onCreate(async (snap:any, context:any)=>{
      const jwt = getJwt();
      const apiKey = getApiKey();
      const spreadsheetId = '1LXtYyQh0yp2Bw1CHPo5FJNwAiJTdhPYeeYpQwiPZHOg';
      const range = 'A1';

      try{
        const data = await getMyResultAsync(snap.val().weleEmail ? snap.val().weleEmail : '')
        if(!data){
          const date = new Date()
          const row = [`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          , snap.val().displayName, snap.val().weleEmail , snap.val().condition , 
          snap.val().place, snap.val().purpose , snap.val().weleChannel, 
          snap.val().city, snap.val().ad]
          appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
        }
      }catch(err){
        console.log('ERR', err)
      }
     

     
      return true 
})
  



function getJwt() {
  var credentials = {
    "type": "service_account",
    "project_id": "wele-app",
    "private_key_id": "<private key>",
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
    key:"<API KEY>"
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
