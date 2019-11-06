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
    return new Promise((resolve, reject) => {
      const reConverEmail = email.toString().replace('.', '<dot>').replace('[', '<open>').replace(']', '<close>').replace('#', '<sharp>').replace('$', '<dollar>').replace('.', '<dot>').replace('.', '<dot>').replace('.', '<dot>')
    

      const resultRef = admin.database().ref(`/results/${reConverEmail}`)
  
      
      resultRef.once('value', async (snapshots: any) => {
          resolve(snapshots._snapshot.value)    
      })
    })
}


exports.impersonateMakeUpperCase = functions.database.ref('/users/{userid}').onCreate(async (snap:any, context:any)=>{
      const jwt = getJwt();
      const apiKey = getApiKey();
      const spreadsheetId = '1LXtYyQh0yp2Bw1CHPo5FJNwAiJTdhPYeeYpQwiPZHOg';
      const range = 'A1';

      const data = await getMyResultAsync(snap.val().weleEmail)

      if(!data){
        const date = new Date()
        const row = [`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        , snap.val().displayName, snap.val().weleEmail , snap.val().condition , 
        snap.val().place, snap.val().purpose , snap.val().weleChannel, 
        snap.val().city, snap.val().ad]
        appendSheetRow(jwt, apiKey, spreadsheetId, range, row);
      }
      return true 
})
  



function getJwt() {
  var credentials = {
    "type": "service_account",
    "project_id": "wele-app",
    "private_key_id": "12fe17108c58f3b94b5598b2b798360068bcd69c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCo7gh0fEOZjeLM\nsbh0gK2DlLSUB5F54aQUKYCyq1qD+4guoG3lGC09F/GBZMVP9bFPvbMUn+zxm/k2\nvEzXadU/xJMgoqkP6O+XW9KhVyrao2QBNNcvMNOobY5HMLEQ+LkZbAW63HZOH7k5\ngGfKImhHnrqG+1D4DPrbH/7RSE6uMfUvPbWDeR6evMiAhqeaCoF75pHMqUXctitu\n5iMXR10Em7sT/N6JRZfeDRSIpFJkx72hz2mgQQJfX4A0FeDcmButVYJiZNTu/NdJ\nT2N7/xteAa4wQneuL/KRPEWHwykNBzsWSCX0diCtuFRb3nyhA2m+OARwWkvcMo0s\nm/uvb4knAgMBAAECggEAFN3+dmEpOo0f0Hg9mEqS5HeYjNaYfk1EpubvimKHVlla\nW6QenxeK8wqDnx+zDesEIZ0Fw4zzyG6jbML63PsqR+vA3t2o85mrCu/hR2PMm+Bm\nCI4d7Krj4mDSG/IkVTvcJYtF8+yqwoDBsRwu9fWlGv+8+9KMkG+OB0ZfBDwh1/uJ\ndGCQETaeWz4RVXMQBuOf4qQWFMBTPcv7wyB9sikfgrBEFh59Yh2zGjC2PECf65EH\nCMIdUzBob2qgmweNlc6sU4/xdvuB3b/5w9rjwI+xGeW7wTbM+ag3LQGeMgTFX7Gq\nifbmwyQCTxm2VWYpZMtYH/CvIG4QkLoUvc4QvFIlIQKBgQDR+R8yDHKHj+u4B+6I\n9mR0qrySmLAXcyU2feCYN/IKGmU5mGdTTnjGVYeAVcxaqplST+4EIW4WuVFxIFhk\nU3/GtFcNZCxWBy/5spbqr1C/AEWKgqGXlXGJuVNCJo72Siz3QFTh4yJSx//IddcU\najyIHD3QkmAFfWyExy5UTxH3oQKBgQDN9bgrRt/l0XCU59Rklvqhr/olH6CTRLwW\niXMu7NeCIhzd92ZQybciZUC1Gls+OT4BhIj2JJj35GGCjrscdHgQmOqQyqUv43UI\nmch4Lzf2BF/8kBdb4mDwTqS30DtI/izW/Kh4s7dWdKdovyImhQTtYyZENltC4exc\nOye4J+ArxwKBgE+7X6MrotnjRsktCeEsXt0GcHDiVguxh7H3fq+OnvRDLaj/PE0g\nATCfDcMn0V+kZHAjNeiPoTQzzr88XxRJuL2FgYDuRv+r3wXcUP5w8CJ3QfDkxeO/\ntctsejcmWScg545D+XeFPmVc2L4QMUnpRW8R+k8XJisvg2OwFuGg3NvBAoGASUFS\npiHpVQavcmcaxkRlFMlQwY+EP509AQ8WZuRaqrCTb+ek/qsgdh1pbIDZX0Jg6Y1I\nYbQWrGUQwa0epDpQ0iZxl9pb8rKGV+7KvOSelORtd5mQlV/pds+iCrcHvyiYrkbj\nbTsOxLNtL/Z7oRPC8uRHIg/rWdidhxiLQhb8xtUCgYBAWXrrRGekYPRyHlw/e4Jb\nWgdvVyvzgjemS5I/wv2DAIM7j13HmjevyRe/anyiM9Nuj3OAkuV06OX3yGcMAdr/\nXJr9lPDuJRIo7Q+/bcqU7NIvpwNUfh4u7AD2AcJ5kWS3asIfqgN7TMDZ1RO120ws\nKMSUC5pB6Q3xOMHjxzWgUA==\n-----END PRIVATE KEY-----\n",
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
