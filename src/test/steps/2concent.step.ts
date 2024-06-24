import { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { CLIENT_ID, CLIENT_CODE, MERCHANT_ID, SIGNATURE_TOKEN, REQUEST_ID, REDIRECT_URL, BANK_CODE, ACCESS_TOKEN } from '../../config/env';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import { expect } from "@playwright/test";
import { verify } from 'crypto';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let accessToken: string;
let consentUrl: string;
setDefaultTimeout(500000);

const verifyConsentDetails = async (accessToken: string, merchantId: string|any) => {
  const consentDetailsUrl = 'https://obsandbox.onesingleview.com/v1/api/observice/consent/details';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('signature', '01e6a298520ca27270db48bdbd7ed397b1b473f6060330b1fe34f2b969add215'); // Add your signature header here

  const requestBody = {
    dateTimeStamp: '2023-06-14T17:51:03',
    requestID: 'ABCD2108',
    merchantId: merchantId,
    banks: [
      {
        code: 'SAMA',
        consentId: 'urn:SAMA:kac-eccf94b9-231a-49da-9c45-e30f50eaa5f5'
      }
    ]
  };

  try {
    const response = await fetch(consentDetailsUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    const responseBody = await response.json();

    // Verify the response
    expect(responseBody.success).toBe(true);
    expect(responseBody.payload).toBeInstanceOf(Array);
    const consentDetails = responseBody.payload[0];
    expect(consentDetails.code).toBe('SAMA');
    expect(consentDetails.data).toBeDefined();
    expect(consentDetails.data.consentId).toBe('urn:SAMA:kac-eccf94b9-231a-49da-9c45-e30f50eaa5f5');
    expect(consentDetails.data.status).toBe('Authorized');
    console.log("2 Creating consent and verifying consent details test passed");

    // Additional assertions can be added here to verify other fields in the response
  } catch (error) {
    await verifyConsentDetails(accessToken, merchantId);
    console.error('Error making the request:', error);
    throw error;
  }
};

// Initialize browser before all scenarios
BeforeAll(async () => {
  browser = await chromium.launch({ headless: false, slowMo: 50 }); // run in headed mode with a slight delay between actions
  context = await browser.newContext();
  page = await context.newPage();
});

// Close browser after all scenarios
AfterAll(async () => {
  await page.close();
  await context.close();
  await browser.close();
});

Given('I have the generated access token', async () => {
  accessToken = process.env.accessToken || '';
  expect(accessToken.length).toBeGreaterThan(0);
});

When('I send a POST request to the Consent API', async () => {
  const requestBody = {
    dateTimeStamp: "2023-06-14T17:51:03",
    requestID: REQUEST_ID,
    merchantId: MERCHANT_ID,
    useCaseType: "AISP",
    redirectUrl: REDIRECT_URL,
    banks: [
      {
        code: BANK_CODE,
        permissions: [
          "ReadAccountsBasic",
          "ReadAccountsDetail",
          "ReadBalances",
          "ReadParty",
          "ReadPartyPSU",
          "ReadPartyPSUIdentity",
          "ReadBeneficiariesBasic",
          "ReadBeneficiariesDetail",
          "ReadTransactionsBasic",
          "ReadTransactionsDetail",
          "ReadTransactionsCredits",
          "ReadTransactionsDebits",
          "ReadScheduledPaymentsBasic",
          "ReadScheduledPaymentsDetail",
          "ReadDirectDebits",
          "ReadStandingOrdersBasic",
          "ReadStandingOrdersDetail"
        ],
        expiryDate: "2025-12-31T10:40:00+02:00",
        txnFromDate: "2016-01-01T10:40:00+02:00",
        txnToDate: "2025-12-31T10:40:00+02:00",
        accountType: "retail"
      }
    ]
  };

  const url = 'https://obsandbox.onesingleview.com/v1/api/observice/connect';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${ACCESS_TOKEN}`);
  headers.append('signature', "1ac72025fd035aa629183f56d8fb403d7ef7fbcd83e54eff6e0e972c30a79ff7");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    const responseBody = await response.json();
    consentUrl = responseBody.payload[0].bankRedirectUrl;
    expect(consentUrl).toBeDefined();
    console.log(consentUrl);
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
});

When('I navigate to the URL from the response', async () => {
  await page.goto(consentUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('input[name="username"]');
});

When('I log in and select items', async () => {
  // Login
  await page.fill('input[name="username"]', 'mits');
  await page.fill('input[name="password"]', 'mits');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  // Wait for navigation after login

  // Select two items
  await page.locator('text=10000109010102').click();
  await page.locator('text=10000109010103').click();
  await page.locator('text=Confirm').nth(1).click();

  // Wait for success message
  await page.waitForSelector('text="Success!"');
});

Then('I should see a success message', async () => {
  const successMessage = await page.textContent('text="Success!"');
  expect(successMessage).toContain('Success!');
  console.log("Verify Completed");
  await page.close();
});

Then('I should verify the consent details', async () => {
  try {
    await verifyConsentDetails(accessToken, MERCHANT_ID);
  } catch (error) {
    console.error('Error verifying consent details:', error);
    throw error;
  }
});
