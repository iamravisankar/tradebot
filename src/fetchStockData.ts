import axios, { AxiosResponse } from 'axios';

// Replace with your Paytm Money API token
const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJtZXJjaGFudCIsImlzcyI6InBheXRtbW9uZXkiLCJpZCI6NTU4MzkzLCJleHAiOjE2OTY3MDMzOTl9.qB5G7xSe7g8WNu9B-APGJHzSz3NfSNRl9_U3RcwGXsA';

// Define the URL for fetching Tata Motors' price
const apiUrl: string = 'https://developer.paytmmoney.com/data/v1/price/live';

// Define the preferences for Tata Motors
const preferences: string[] = [
    'NSE:17167:EQUITY',
    'NSE:14993:EQUITY',
    // Add more stocks as needed
];

// Define the mode (LTP, QUOTE, FULL) as per your requirement
const mode: string = 'FULL';

interface StockData {
    data: {
        last_price: number;
    }[];
    LTP?: {
        last_price: number;
    };
}

// Make the API request
axios
  .get<StockData>(apiUrl, {
    headers: {
      'x-jwt-token': authToken,
    },
    params: {
      mode: mode,
      pref: preferences.join(','),
    },
  })
  .then((response: AxiosResponse<StockData>) => {
    const data = response.data;
    // Parse and display the relevant data
    console.log(JSON.stringify(data.data));
  })
  .catch((error: Error) => {
    console.error('Error fetching Tata Motors price:', error.message);
  });
