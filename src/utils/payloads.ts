import { BANK_CODE, MERCHANT_ID, CONSENT_ID } from "../config/env";


export const getAAPayload = () => {
    return {
      dateTimeStamp: "2023-06-14T17:51:03",
      requestID: "ABCD2108",
      merchantId: MERCHANT_ID,
      fromDate: "2016-01-01T10:40:00+02:00",
      toDate: "2025-12-31T10:40:00+02:00",
      accountAggregation: true,
      banks: [
        {
          code: BANK_CODE,
          consentId: CONSENT_ID
        }
      ]
    };
  };
  