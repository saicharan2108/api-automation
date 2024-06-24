import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ACCESS_TOKEN, BANK_CODE, MERCHANT_ID } from '../../config/env';

let response: any;

const fetchAllAccountsStandingOrders = async () => {
  const domain = 'https://obsandbox.onesingleview.com';
  const endpoint = '/v1/api/observice/allAccountsStandingOrders';
  const url = `${domain}${endpoint}`;
  const token = ACCESS_TOKEN;
  const signature = 'd30807e79e3dcb80e24ced79df31ca6d209a854383cf8f892b87f627d5212e7f';

  const requestBody = {
    dateTimeStamp: '2023-06-14T17:51:03',
    requestID: 'ABCD2108',
    merchantId: MERCHANT_ID,
    banks: [
      {
        code: BANK_CODE,
        consentId: 'urn:SAMA:kac-8d64a393-bfeb-4722-bf91-2853b193f3a1'
      }
    ],
    accountAggregation: true
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
    console.error('Error fetching all accounts standing orders:', error);
    throw error;
  }
};

Given('I have the necessary API details for standing orders', async function () {
  // No action required here for this example
});

When('I send a request to the all accounts standing orders API', async function () {
  response = await fetchAllAccountsStandingOrders();
});

Then('I should receive a successful response for all accounts standing orders', async function () {
  expect(response).toBeDefined();
  expect(response.success).toBe(true);
});

Then('the response payload should contain the account standing order details', async function () {
  const payload = response.payload;
  expect(payload).toBeDefined();
  expect(payload.length).toBeGreaterThan(0);

  const accountDetails = payload[0].data.account;
  expect(accountDetails).toBeDefined();
  expect(accountDetails.length).toBeGreaterThan(0);

  const account = accountDetails[0];
  expect(account.accountId).toBe('100004000000000000000002');
  expect(account.accountHolderName).toBe('Mitsuhirato');
  
  const standingOrders = account.standingOrder;
  expect(standingOrders).toBeDefined();
  expect(standingOrders.length).toBeGreaterThan(0);

  const standingOrder = standingOrders[0];
  expect(standingOrder.standingOrderId).toBe('001010000000000000000113');
  expect(standingOrder.frequency).toBe('WkInMnthDay:02:05');
  expect(standingOrder.creditorReference).toBe('GSG 10 BANK ROAD');
  await console.log("8 Getting all accounts standing orders test passed")

  // Add more checks based on your requirements
});
