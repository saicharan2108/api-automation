import { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { setGeneratedToken, CLIENT_ID, CLIENT_CODE, MERCHANT_ID } from '../../config/env';
import { Browser, BrowserContext, chromium } from 'playwright';
import { expect } from "@playwright/test";

setDefaultTimeout(500000);

let browser: Browser;
let context: BrowserContext;
const MAX_RETRIES = 5;  // Maximum number of retries
let retryCount = 0;

// Initialize browser before all scenarios
BeforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
});

// Close browser after all scenarios
AfterAll(async () => {
  await context.close();
  await browser.close();
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchAccessToken = async () => {
  const requestBody = {
    clientId: CLIENT_ID,
    clientCode: CLIENT_CODE,
    merchantId: MERCHANT_ID,
    grantType: 'client_credentials'
  };

  const url = 'https://obsandbox.onesingleview.com/v1/api/observice/token';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('signature', '0eeedebcec7394e997d129cc4ea91c3ee01c9dc45a2dd633618054fbc072d6e3');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseBody = await response.json();

    if (!responseBody.success) {
      throw new Error('Response indicates failure');
    }

    const accessToken = responseBody.payload.access_token;

    if (!accessToken || typeof accessToken !== 'string' || accessToken.length === 0) {
      throw new Error('Invalid access token received');
    }

    setGeneratedToken(accessToken);

  } catch (error) {
    console.error('Error fetching access token:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying... Attempt ${retryCount}`);
      await delay(2000); // Delay before retrying (2 seconds in this example)
      await fetchAccessToken(); // Retry fetching access token
    } else {
      throw new Error('Maximum retry attempts exceeded');
    }
  }
};

Given('I have API1 endpoint details', async () => {
  // Use existing context
});

When('I send a POST request to retrieve the access token', async () => {
  retryCount = 0; // Reset retry count before attempting to fetch access token
  await fetchAccessToken();
});

Then('the access_token should be stored in environment variables', async () => {
  const storedToken = process.env.accessToken;
  expect(storedToken).toBeDefined();
  if (storedToken) {
    expect(storedToken.length).toBeGreaterThan(0);
  }
  console.log("Token generation test passed");
});
