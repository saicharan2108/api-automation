"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGeneratedUrl = exports.setGeneratedToken = exports.GENERATED_URL = exports.GENERATED_TOKEN = exports.LG_CONSENT_ID = exports.BANK_CODE = exports.REDIRECT_URL = exports.PAYMENT_INTENT_ID = exports.ACCESS_TOKEN_2 = exports.ACCESS_TOKEN = exports.MERCHANT_ID = exports.APP_ID = exports.MOBILE = exports.EMAIL = exports.SIGNATURE = exports.CLIENT_CODE = exports.CLIENT_ID = exports.ACCOUNT_ID = exports.CONSENT_ID = exports.REQUEST_ID = exports.DOMAIN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
// Load environment variables
exports.DOMAIN = process.env.domain;
exports.REQUEST_ID = process.env.RequestID;
exports.CONSENT_ID = process.env.ConsentId;
exports.ACCOUNT_ID = process.env.AccountId;
exports.CLIENT_ID = process.env.clientId;
exports.CLIENT_CODE = process.env.clientCode;
exports.SIGNATURE = process.env.signature;
exports.EMAIL = process.env.email;
exports.MOBILE = process.env.mobile;
exports.APP_ID = process.env.appId;
exports.MERCHANT_ID = process.env.merchantId;
exports.ACCESS_TOKEN = process.env.accessToken;
exports.ACCESS_TOKEN_2 = process.env.access_token;
exports.PAYMENT_INTENT_ID = process.env.PaymentIntentId;
exports.REDIRECT_URL = process.env.redirectUrl;
exports.BANK_CODE = process.env.bankCode;
exports.LG_CONSENT_ID = process.env.LGConsentId;
// Functions to set generated token and URL
exports.GENERATED_TOKEN = process.env.GENERATED_TOKEN || '';
exports.GENERATED_URL = process.env.GENERATED_URL || '';
function setGeneratedToken(token) {
    exports.GENERATED_TOKEN = token;
    process.env.GENERATED_TOKEN = token;
    saveEnv();
}
exports.setGeneratedToken = setGeneratedToken;
function setGeneratedUrl(url) {
    exports.GENERATED_URL = url;
    process.env.GENERATED_URL = url;
    saveEnv();
}
exports.setGeneratedUrl = setGeneratedUrl;
function saveEnv() {
    const envVariables = `
    domain=${exports.DOMAIN}
    RequestID=${exports.REQUEST_ID}
    ConsentId=${exports.CONSENT_ID}
    AccountId=${exports.ACCOUNT_ID}
    clientId=${exports.CLIENT_ID}
    clientCode=${exports.CLIENT_CODE}
    signature=${exports.SIGNATURE}
    email=${exports.EMAIL}
    mobile=${exports.MOBILE}
    appId=${exports.APP_ID}
    merchantId=${exports.MERCHANT_ID}
    accessToken=${exports.ACCESS_TOKEN}
    access_token=${exports.ACCESS_TOKEN_2}
    PaymentIntentId=${exports.PAYMENT_INTENT_ID}
    redirectUrl=${exports.REDIRECT_URL}
    bankCode=${exports.BANK_CODE}
    LGConsentId=${exports.LG_CONSENT_ID}
    GENERATED_TOKEN=${exports.GENERATED_TOKEN}
    GENERATED_URL=${exports.GENERATED_URL}
  `;
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '../../.env'), envVariables);
}
