import axios from 'axios';
import { setDefaultTimeout } from '@cucumber/cucumber';
import { v4 as uuidv4 } from 'uuid';
import { setSignatureToken, setRequestId } from "../config/env";
import { CONSENT_ID } from '../config/env';

setDefaultTimeout(500000)
const clientId = 'jUWGybeMmp3M';
const clientCode = 'c5201053-d5e0-4d76-bd7b-baa4fa69bef7';
const signatureUrl = "https://obsandbox.onesingleview.com/v1/api/observice/signature";


const body = {
  "dateTimeStamp": "2023-06-14T17:51:03",
  "requestID": "ABCD2108",
  "merchantId": "ARIF-300487",
  "fromDate": "2016-01-01T10:40:00+02:00",
  "toDate": "2025-12-31T10:40:00+02:00",
  "accountAggregation": true,
  "banks": [
    {
      "code": "SAMA",
      "consentId": CONSENT_ID
    }
  ]
};

const headers ={
  clientId: 'jUWGybeMmp3M',
  clientCode: 'c5201053-d5e0-4d76-bd7b-baa4fa69bef7',
  'Content-Type': 'application/json'
}
// Function to get the signature
const getSignature = async (bodyEle: any) => {
  try {
    // Generate a unique Request ID for internal use
    // const requestId = uuidv4();
    // console.log(`Request ID: ${requestId}`);
    // await setRequestId(requestId);

    const res = await axios.get(signatureUrl, {
      headers:headers,
      data: body  // Axios allows sending data with GET requests
    });

   // Check the response status
   if (res.status !== 200) {
    throw new Error(`HTTP error! status: ${res.status}`);

  }
  if (res.status === 200) {
  // Process the response
  const data = res.data;
  // await console.log("Signature fetched:", data.signature);
  // await console.log("New Signature Found Successfully- ------------------------------------------------------------------------------------")

  // Set the signature token in the environment
  await setSignatureToken(data.signature);
  
  // Return the signature
  return data.signature; 
  }
} catch (error) {
  getSignature(body);
  // console.error('Error making the request:', error);
  // throw error;
}
};




// Export the function
export default getSignature;










