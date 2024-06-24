var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Given, When, Then } from '@cucumber/cucumber';
import { expect, request as playwrightRequest } from '@playwright/test';
import { DOMAIN, CLIENT_ID, CLIENT_CODE, MERCHANT_ID, setGeneratedToken } from '../config/env';
let request;
let responseBody;
Given('I have the necessary credentials to generate a token', function () {
    return __awaiter(this, void 0, void 0, function* () {
        request = yield playwrightRequest.newContext({
            baseURL: DOMAIN,
        });
        // Assume the credentials are loaded from the .env file
        expect(DOMAIN).toBeDefined();
        expect(CLIENT_ID).toBeDefined();
        expect(CLIENT_CODE).toBeDefined();
        expect(MERCHANT_ID).toBeDefined();
    });
});
When('I request a token', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield request.post('/v1/api/observice/token', {
            headers: {
                'Cookie': 'acw_tc=9bbb21ffec855930182cb3bedb37b174fe2488578bec6ed6234bc41dbfba8409',
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            data: {
                clientId: CLIENT_ID,
                clientCode: CLIENT_CODE,
                merchantId: MERCHANT_ID,
                grantType: 'client_credentials',
            }
        });
        responseBody = yield response.json();
        expect(response.status()).toBe(200);
        expect(responseBody.success).toBe(true);
        expect(responseBody.payload.access_token).toBeDefined();
    });
});
Then('I should receive an access token', function () {
    const accessToken = responseBody.payload.access_token;
    expect(accessToken).toBeDefined();
});
Then('I store the access token in the environment', function () {
    const accessToken = responseBody.payload.access_token;
    setGeneratedToken(accessToken);
});
