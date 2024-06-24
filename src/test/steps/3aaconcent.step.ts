import { Given, When, Then, BeforeAll, AfterAll , setDefaultTimeout} from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import { expect } from "@playwright/test";
import {setGeneratedConcentId} from '../../config/env'
import getSignature from '../../utils/utils'
import { getAAPayload } from '../../utils/payloads';
setDefaultTimeout(5000000)

// Constants and configuration from environment
import {
  CLIENT_ID,
  CLIENT_CODE,
  MERCHANT_ID,
  SIGNATURE_TOKEN,
  REQUEST_ID,
  REDIRECT_URL,
  BANK_CODE,
  ACCESS_TOKEN,
  CONSENT_ID
} from '../../config/env';
import { truncate } from 'fs';
import { verify } from 'crypto';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let accessToken: string;
let consentUrl: string;

// Before all scenarios: Launch browser and set up context
BeforeAll(async () => {
  browser = await chromium.launch({ headless: true, slowMo: 50 });
  context = await browser.newContext();
  page = await context.newPage();
});

// After all scenarios: Close browser and cleanup
AfterAll(async () => {
  await page.close();
  await context.close();
  await browser.close();
});

Given('I have the generated access token for account aggregation', async () => {
  accessToken = process.env.accessToken || '';
  expect(accessToken.length).toBeGreaterThan(0);
});

When('I send a POST request to create an account aggregation consent', async () => {
  const requestBody = {
    dateTimeStamp: "2023-06-14T17:51:03",
    requestID: REQUEST_ID,
    merchantId: MERCHANT_ID,
    useCaseType: "ACCOUNTAGGREGATION",
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

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'signature': "fcf7955c3be06e1b8a88aba549473c611b7c01abfedf8486430e92906facc8c4"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    const responseBody = await response.json();
    await console.log(responseBody);
    consentUrl = responseBody.payload[0].bankRedirectUrl;
    const consentId = responseBody.payload[0].data.consentId;
    // await console.log('Consent Id: ' , consentId)
    await setGeneratedConcentId(consentId);

    expect(consentUrl).toBeDefined();
    // console.log("Consent URL:", consentUrl);
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
});

When('I navigate to the consent URL', async () => {
  await page.goto(consentUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('input[name="username"]');
});

When('I log in and select items for account aggregation', async () => {
  // Login
  await page.fill('input[name="username"]', 'mits');
  await page.fill('input[name="password"]', 'mits');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000); // Adjust timeout as needed
  
  // Select two items
  await page.click('text=10000109010102');
  await page.click('text=10000109010103');
  await page.click('text=Confirm');
});

Then('I should receive a valid consent URL', async () => {
  expect(consentUrl).toBeDefined();
  // console.log("Received consent URL:", consentUrl);
});

// Then('I should verify the consent details for account aggregation', async () => {
//   const consentDetailsUrl = 'https://obsandbox.onesingleview.com/v1/api/observice/accountAggregation';

//   const requestBody = {
//     dateTimeStamp: "2023-06-14T17:51:03",
//     requestID: 'ABCD2108',
//     merchantId: MERCHANT_ID, // Ensure MERCHANT_ID is defined
//     fromDate: "2016-01-01T10:40:00+02:00",
//     toDate: "2025-12-31T10:40:00+02:00",
//     accountAggregation: true,
//     banks: [
//       {
//         code: BANK_CODE, // Ensure BANK_CODE is defined
//         consentId: "urn:SAMA:kac-8d64a393-bfeb-4722-bf91-2853b193f3a1" // Ensure CONSENT_ID is defined
//       }
//     ]
//   };

//   await console.log("Getting New Signature ................................................................................")

//   let sign = await getSignature(getAAPayload())
//   await console.log(`New Signature`, sign)


//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${ACCESS_TOKEN}`,
//     'signature': "dd942eb864992416b08251faf58ffd486d7ffe87c66863ab24ff98f143eb53f3"
//   };

//   try {
//     const response = await fetch(consentDetailsUrl, {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(requestBody),
//     });

//     const responseBody = await response.json();
//     await console.log(requestBody)
//     await console.log("Consent Details:", responseBody);

//     // Assertions for consent details
//     expect(responseBody.success).toBe(true);
//     await console.log("Final Rsult here:", responseBody)
//     expect(responseBody.payload).toBeInstanceOf(Array);
//     const consentDetails = responseBody.payload[0];
//     expect(consentDetails.code).toBe('SAMA');
//     expect(consentDetails.data).toBeDefined();
//     expect(consentDetails.consentId).toBe("urn:SAMA:kac-8d64a393-bfeb-4722-bf91-2853b193f3a1");
//     // expect(consentDetails.data.status).toBe('AwaitingAuthorization');
//   } catch (error) {
//     console.error('Error making the request:', error);
//     throw error;
//   }
// });


Then('I should verify the consent details for account aggregation', async () => {
  const consentDetailsUrl = 'https://obsandbox.onesingleview.com/v1/api/observice/accountAggregation';

  const requestBody = {
    dateTimeStamp: "2023-06-14T17:51:03",
    requestID: 'ABCD2108',
    merchantId: MERCHANT_ID, // Ensure MERCHANT_ID is defined
    fromDate: "2016-01-01T10:40:00+02:00",
    toDate: "2025-12-31T10:40:00+02:00",
    accountAggregation: true,
    banks: [
      {
        code: BANK_CODE, // Ensure BANK_CODE is defined
        consentId: "urn:SAMA:kac-8d64a393-bfeb-4722-bf91-2853b193f3a1" // Ensure CONSENT_ID is defined
      }
    ]
  };

  // await console.log("Getting New Signature ................................................................................");

  let sign = await getSignature(getAAPayload());
  // await console.log(`New Signature`, sign);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'signature': sign || "dd942eb864992416b08251faf58ffd486d7ffe87c66863ab24ff98f143eb53f3"
  };

  const verifiyAccountAggregation = async (): Promise<void> => {
    try {
      const response = await fetch(consentDetailsUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      const responseBody = await response.json();
      // await console.log(requestBody);
      // await console.log("Consent Details:", responseBody);

      // Assertions for consent details
      expect(responseBody.success).toBe(true);
      // await console.log("Final Result here:", responseBody);
      expect(responseBody.payload).toBeInstanceOf(Array);
      const consentDetails = responseBody.payload[0];
      expect(consentDetails.code).toBe('SAMA');
      expect(consentDetails.data).toBeDefined();
      expect(consentDetails.consentId).toBe("urn:SAMA:kac-8d64a393-bfeb-4722-bf91-2853b193f3a1");
      await console.log("3 Getting Accounts Aggregation test passed")

      return;
      // expect(consentDetails.data.status).toBe('AwaitingAuthorization');
    } catch (error) {
        return verifiyAccountAggregation();
      }
    }
  

  await verifiyAccountAggregation();
});
