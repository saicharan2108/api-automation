import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Load environment variables
export const DOMAIN = process.env.domain;
export let REQUEST_ID = process.env.RequestID;
export let CONSENT_ID = process.env.ConsentId;
export const ACCOUNT_ID = process.env.AccountId;
export const CLIENT_ID = process.env.clientId;
export const CLIENT_CODE = process.env.clientCode;
export const SIGNATURE = process.env.signature;
export const EMAIL = process.env.email;
export const MOBILE = process.env.mobile;
export const APP_ID = process.env.appId;
export const MERCHANT_ID = process.env.merchantId;
export let  ACCESS_TOKEN = process.env.accessToken;
// export const ACCESS_TOKEN_2 = process.env.access_token;
export const PAYMENT_INTENT_ID = process.env.PaymentIntentId;
export const REDIRECT_URL = process.env.redirectUrl;
export const BANK_CODE = process.env.bankCode;
export const LG_CONSENT_ID = process.env.LGConsentId;

// Functions to set generated token and URL
// export let ACCESS_TOKEN = process.env.GENERATED_TOKEN || '';
export let GENERATED_URL = process.env.GENERATED_URL || '';
export let SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN || '';

export function setGeneratedToken(token: string) {
    ACCESS_TOKEN = token;
  process.env.accessToken = token;
  saveEnv();
}

export function setRequestId(reqId: string) {
    REQUEST_ID = reqId;
  process.env.RequestID = REQUEST_ID;
  saveEnv();
}
export function setGeneratedConcentId(consent: string) {
  CONSENT_ID = consent;
process.env.ConsentId = CONSENT_ID;
saveEnv();
}



export function setSignatureToken(token: string) {
  SIGNATURE_TOKEN = token;
  process.env.SIGNATURE_TOKEN = token;
  saveEnv();
}

export function setGeneratedUrl(url: string) {
  GENERATED_URL = url;
  process.env.GENERATED_URL = url;
  saveEnv();
}

function saveEnv() {
  const envVariables = `
    domain=${DOMAIN}
    RequestID=${REQUEST_ID}
    ConsentId=${CONSENT_ID}
    AccountId=${ACCOUNT_ID}
    clientId=${CLIENT_ID}
    clientCode=${CLIENT_CODE}
    signature=${SIGNATURE}
    email=${EMAIL}
    mobile=${MOBILE}
    appId=${APP_ID}
    merchantId=${MERCHANT_ID}
    accessToken=${ACCESS_TOKEN}
    access_token=${ACCESS_TOKEN}
    PaymentIntentId=${PAYMENT_INTENT_ID}
    redirectUrl=${REDIRECT_URL}
    bankCode=${BANK_CODE}
    LGConsentId=${LG_CONSENT_ID}
    GENERATED_URL=${GENERATED_URL}
    SIGNATURE_TOKEN=${SIGNATURE_TOKEN}
  `;
  fs.writeFileSync(path.join(__dirname, '../../.env'), envVariables.trim());
}
