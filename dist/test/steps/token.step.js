"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Given, When, Then } = require('@cucumber/cucumber');
const chai = require('chai');
const chaiHttp = require('chai-http');
const pw = require('playwright');
chai.use(chaiHttp);
const { expect } = chai;
let response;
let apiEndpoint;
let headers;
let requestBody;
Given('I set the API endpoint to {string}', (endpoint) => {
    apiEndpoint = endpoint;
});
Given('I set the request headers', () => {
    headers = {
        'Cookie': '9bbb21ffec855930182cb3bedb37b174fe2488578bec6ed6234bc41dbfba8409',
        'Content-Type': 'application/json',
        'Accept': '/'
    };
});
Given('I set the request body with clientId {string}, clientCode {string}, and merchantId {string}', (clientId, clientCode, merchantId) => {
    requestBody = {
        clientId,
        clientCode,
        merchantId,
        grantType: 'client_credentials'
    };
});
When('I send a POST request to the API', () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield pw.chromium.launch();
    const context = yield browser.newContext();
    const page = yield context.newPage();
    response = yield page.request.post(apiEndpoint, {
        headers,
        data: requestBody
    });
    yield browser.close();
}));
Then('the response status should be {int}', (status) => {
    expect(response.status()).to.equal(status);
});
Then('the response should contain an access token', () => __awaiter(void 0, void 0, void 0, function* () {
    const responseBody = yield response.json();
    expect(responseBody.success).to.be.true;
    expect(responseBody.payload).to.have.property('access_token');
}));
Then('I store the access token in the environment', () => __awaiter(void 0, void 0, void 0, function* () {
    const responseBody = yield response.json();
    const accessToken = responseBody.payload.access_token;
    // console.log(accessToken);
    process.env.ACCESS_TOKEN = accessToken;
}));
