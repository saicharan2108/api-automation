import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ACCESS_TOKEN, BANK_CODE, MERCHANT_ID } from '../../config/env';
import { error } from 'console';

let response: any;

const fetchAllAccountsTransactions = async () => {
  const domain = 'https://obsandbox.onesingleview.com';
  const endpoint = '/v1/api/observice/allAccountsTransactions';
  const url = `${domain}${endpoint}`;
  const token = ACCESS_TOKEN;
  const signature = 'dd942eb864992416b08251faf58ffd486d7ffe87c66863ab24ff98f143eb53f3';

  const requestBody = {
    dateTimeStamp: '2023-06-14T17:51:03',
    requestID: 'ABCD2108',
    merchantId: MERCHANT_ID,
    fromDate: '2016-01-01T10:40:00+02:00',
    toDate: '2025-12-31T10:40:00+02:00',
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
      // await console.log(response)
    }


    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all accounts transactions details:', error);
    throw error;
  }
};

Given('I have the necessary API details for all accounts transactions', async function () {
  // No action required here for this example
});

When('I send a request to the all accounts transactions API', async function () {
  response = await fetchAllAccountsTransactions();
});

Then('I should receive a successful response for all accounts transactions', async function () {
  expect(response).toBeDefined();
  expect(response.success).toBe(true);
});

Then('the response payload should contain the account transactions details', async function () {
  const payload = response.payload;
  expect(payload).toBeDefined();
  expect(payload.length).toBeGreaterThan(0);

  const accountDetails = payload[0].data.account;
  expect(accountDetails).toBeDefined();
  expect(accountDetails.length).toBeGreaterThan(0);

  const transactions = accountDetails[0].transactions;
  expect(transactions).toBeDefined();
  expect(transactions.length).toBeGreaterThan(0);

  const transaction = transactions[0];
  expect(transaction.transactionId).toBe('e0e11370-eb2d-4694-8bed-571c7916b05e');
  expect(transaction.transactionType).toBe('KSAOB.InternationalTransfer');
  expect(transaction.amount.amount).toBe('6.20');
  expect(transaction.amount.currency).toBe('SAR');
  expect(transaction.creditDebitIndicator).toBe('KSAOB.Credit');
  expect(transaction.status).toBe('KSAOB.Booked');
  await console.log("6 Getting all accounts transactions test passed")


  // Add more assertions based on your requirements
});
