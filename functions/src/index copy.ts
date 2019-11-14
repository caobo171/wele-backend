import * as functions from 'firebase-functions';


import * as admin from 'firebase-admin';
import { google } from 'googleapis';
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//@ts-ignore
const validKey = (key: string) => {
  return key.toString()
    .replace('.', 'weledotwele')
    .replace('[', 'weleopenwele')
    .replace(']', 'weleclosewele')
    .replace('#', 'welesharpwele')
    .replace('$', 'weledollarwele')
    .replace('.', 'weledotwele')
    .replace('.', 'weledotwele')
    .replace('.', 'weledotwele')

}


exports.impersonateMakeUpperCase = functions.database.ref('/users/{userid}').onCreate(async (snap: any, context: any) => {
  const jwt = getJwt();
  const apiKey = getApiKey();
  const spreadsheetId = '1LXtYyQh0yp2Bw1CHPo5FJNwAiJTdhPYeeYpQwiPZHOg';
  const range = 'A1';
  const range2 = "A1:M"
  const email = snap.val().weleEmail

  const res = await checkEmailExist(spreadsheetId, range2, email,jwt, apiKey)


  if(!res ) return 
  try {

      console.log(111)
      const date = new Date()
      const row = [
        `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        , snap.val().displayName
        , snap.val().weleEmail
        , snap.val().condition
        , snap.val().place
        , snap.val().purpose
        , snap.val().weleChannel
        , snap.val().city
        , snap.val().ad
      ]
      appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
  } catch (err) {
    console.log('ERR', err)
  }
  return true
})

function getJwt() {
  var credentials = {

    data:
   '<YOUR CREDENTIAL FILE >'
    
  }
  return new google.auth.JWT(
    //@ts-ignore
    credentials.client_email, null, credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

function getApiKey() {
  var apiKeyFile = {
    key: "<API_KEY>"
  }
  return apiKeyFile.key;
}

function appendSheetRow(jwt: any, apiKey: any, spreadsheetId: any, range: any, row: any) {
  console.log(22222)
  const sheets = google.sheets({ version: 'v4' });
  sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    auth: jwt,
    key: apiKey,
    valueInputOption: 'RAW',
    //@ts-ignore
    resource: { values: [row] }
  }, function (err: any, result: any) {
    if (err) {
      throw err;
    }
    else {
      console.log('Updated sheet: ' + result.data.updates.updatedRange);
    }
  });
}

//@ts-ignore
async function checkEmailExist(spreadsheetId: string, range: string, email: string , jwt: any, apiKey: string) {
  // [START sheets_get_values]
  console.log(555555555)
  const sheets = google.sheets({ version: 'v4' });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
    auth: jwt ,
    key: apiKey
  })
  var results = response.data.values;
  console.log(6666666666)
  console.log('check email',email)
  if (results) {
    // console.log('results', JSON.stringify(results))
    for(let i= 0 ; i< results.length; i++){
      // check email exist 

      // console.log(results[i])
      if(results[i] && results[i][2]){
        if(results[i][2].replace(/\s/g, "") === email.replace(/\s/g, "")){
          console.log('EXIST !!!')
          return false
        }
      }
     
    }
  }

  return true

  // [END_EXCLUDE]

  // [END sheets_get_values]
}
