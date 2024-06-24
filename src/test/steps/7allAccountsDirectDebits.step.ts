import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ACCESS_TOKEN, BANK_CODE, MERCHANT_ID } from '../../config/env';

let response: any;

const fetchAllAccountsDirectDebits = async () => {
  const domain = 'https://obsandbox.onesingleview.com';
  const endpoint = '/v1/api/observice/allAccountsDirectDebits';
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
    console.error('Error fetching all accounts direct debits:', error);
    throw error;
  }
};

Given('I have the necessary API details for direct debits', async function () {
  // No action required here for this example
});

When('I send a request to the all accounts direct debits API', async function () {
  response = await fetchAllAccountsDirectDebits();
});

Then('I should receive a successful direct debits response', async function () {
  expect(response).toBeDefined();
  expect(response.success).toBe(true);
});

Then('the response payload should contain the direct debits details', async function () {
  const payload = response.payload;
  expect(payload).toBeDefined();
  expect(payload.length).toBeGreaterThan(0);

  const accountDetails = payload[0].data.account;
  expect(accountDetails).toBeDefined();
  expect(accountDetails.length).toBeGreaterThan(0);

  // Check details for the first account
  const account = accountDetails[0];
  expect(account.accountId).toBe('100004000000000000000002');
  expect(account.accountHolderName).toBe('Mitsuhirato');

  const directDebits = account.directDebit;
  expect(directDebits).toBeDefined();
  expect(directDebits.length).toBeGreaterThan(0);

  // Check details for the first direct debit
  const directDebit = directDebits[0];
  expect(directDebit.directDebitId).toBe('001000000000000000000121');
  expect(directDebit.mandateIdentification).toBe('7248812485188');
  expect(directDebit.directDebitStatusCode).toBe('Active');
  expect(directDebit.name).toBe('SAINSBURYS BANK');
  expect(directDebit.previousPaymentDateTime).toBe('2017-11-21T00:00:00.000Z');
  expect(directDebit.frequency).toBe('KSAOB.Annual');
  expect(directDebit.previousPaymentAmount.amount).toBe('269.83');
  expect(directDebit.previousPaymentAmount.currency).toBe('SAR');
  await console.log("7 Getting all accounts direct debits test passed")

});
