import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ACCESS_TOKEN, BANK_CODE, MERCHANT_ID } from '../../config/env';

let response: any;

const fetchAccountDetails = async () => {
  const domain = 'https://obsandbox.onesingleview.com';
  const endpoint = '/v1/api/observice/accounts';
  const url = `${domain}${endpoint}`;
  const token = ACCESS_TOKEN;
  const signature = '1f16f3577187030d12a74282d0c47821d37164a814e2d3d727d86568097bf607';

  const requestBody = {
    dateTimeStamp: '2023-06-14T17:51:03',
    requestID: 'ABCD2108',
    merchantId: MERCHANT_ID,
    accountAggregation: true,
    banks: [
      {
        code: BANK_CODE,
        consentId: 'urn:SAMA:kac-8d64a393-bfeb-4722-bf91-2853b193f3a1'
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Signature': signature
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    await fetchAccountDetails();
    console.error('Error fetching account details:', error);
    // throw error;
  }
};

Given('I have the necessary API details', async function () {
  // No action required here for this example
});

When('I send a request to the account API', async function () {
  response = await fetchAccountDetails();
});

Then('I should receive a successful response', async function () {
  expect(response).toBeDefined();
  expect(response.success).toBe(true);
});

Then('the response payload should contain the account details', async function () {
  const payload = response.payload;
  expect(payload).toBeDefined();
  expect(payload.length).toBeGreaterThan(0);

  const accountDetails = payload[0].data.account;
  expect(accountDetails).toBeDefined();
  expect(accountDetails.length).toBeGreaterThan(0);

  const account = accountDetails[0];
  expect(account.accountId).toBe('100004000000000000000002');
  expect(account.accountHolderName).toBe('Mitsuhirato');
  await console.log("4 Getting all accounts test passed")

  // Add more checks based on your requirements
});
