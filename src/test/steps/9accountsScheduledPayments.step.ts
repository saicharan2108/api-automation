import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ACCESS_TOKEN, BANK_CODE, MERCHANT_ID } from '../../config/env';

let response: any;

const fetchScheduledBalanceDetails = async () => {
  const domain = 'https://obsandbox.onesingleview.com';
  const endpoint = '/v1/api/observice/allAccountsScheduledPayments';
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
    // await console.log(data)

    return data;
  } catch (error) {
    fetchScheduledBalanceDetails()
    console.error('Error fetching scheduled balance details:', error);
    throw error;
  }
};

Given('I have the necessary API details for scheduled payments', async function () {
  // No action required here for this example
});

When('I send a request to the accounts scheduled payments API', async function () {
  response = await fetchScheduledBalanceDetails();
  
});

Then('I should receive a successful response for scheduled payments', async function () {
  expect(response).toBeDefined();
  expect(response.success).toBe(true);
});

Then('the response payload should contain the scheduled payments details', async function () {
  const payload = response.payload;
  expect(payload).toBeDefined();
  expect(payload.length).toBeGreaterThan(0);

  const accountDetails = payload[0].data.account;
  expect(accountDetails).toBeDefined();
  expect(accountDetails.length).toBeGreaterThan(0);

  const account = accountDetails[0];
  expect(account.accountId).toBe('100004000000000000000002');
  expect(account.accountHolderName).toBe('Mitsuhirato');
  expect(account.scheduledPayment).toBeDefined();
  expect(account.scheduledPayment.length).toBeGreaterThan(0);

  const scheduledPayment = account.scheduledPayment[0];
  expect(scheduledPayment.scheduledPaymentId).toBe('001011000000000000000107');
  expect(scheduledPayment.scheduledPaymentDateTime).toBe('2020-01-27T05:00:00+00:00');
  expect(scheduledPayment.scheduledType).toBe('KSAOB.Arrival');
  expect(scheduledPayment.creditorReference).toBe('reference');
  expect(scheduledPayment.instructedAmount.amount).toBe('10.00');
  expect(scheduledPayment.instructedAmount.currency).toBe('SAR');
  await console.log("9 Getting accounts scheduled payments test passed")

  
  // Add more checks based on your requirements for other accounts and scheduled payments
});
