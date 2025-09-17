// API Endpoint Testing Script
import axios from 'axios';

// API configuration based on application memories
const API_URL = 'https://staging-apps-01-pub.cttexpress.com/item-history-api/private/v1/shipping/shipping-list';
const headers = {
  'Content-Type': 'application/json',
  'client_id': '86377c864c6d4ff3870e9489f12afd36',
  'client_secret': '75Df2175510744edA381A4807078E26C',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjdHQtc2hpcHBpbmctYXBpIiwibmFtZSI6IkNUVCBFeHByZXNzIiwiaWF0IjoxNTE2MjM5MDIyfQ.MZFhHeH61NqrPVXQkLVBZLvKbLQFp8E-IE0xN5ZdROk'
};

// Parameters using broader search criteria to find results
const params = {
  client_center_code: '3248000004', // Using known working value from memory
  recipient_country_code: 'ES',
  shipping_status_codes: '', // Empty to match any status
  recipient_postal_code: '', // Empty to match any postal code
  page_offsets: 0,
  page_limit: 5,
  sort_by: 'shipping_code',
  manifest_datetime_from: '2020-01-01T00:00:00.000Z', // Broader date range
  manifest_datetime_to: '2026-12-31T23:59:59.999Z' // Broader date range
};

console.log('Testing Staging API Endpoint...');
console.log(`URL: ${API_URL}`);
console.log('Headers:', JSON.stringify(headers, null, 2));
console.log('Parameters:', JSON.stringify(params, null, 2));

// Make the API request
axios.get(API_URL, { 
  headers: headers,
  params: params
})
.then(response => {
  console.log('\nAPI Response Status:', response.status);
  console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
  
  // Log response data
  console.log('\nResponse Data:');
  if (response.data) {
    if (Array.isArray(response.data)) {
      console.log(`Retrieved ${response.data.length} items`);
      if (response.data.length > 0) {
        console.log('First item:', JSON.stringify(response.data[0], null, 2));
      } else {
        console.log('No items returned in array');
      }
    } else if (response.data.items && Array.isArray(response.data.items)) {
      console.log(`Retrieved ${response.data.items.length} items`);
      if (response.data.items.length > 0) {
        console.log('First item:', JSON.stringify(response.data.items[0], null, 2));
      } else {
        console.log('No items returned in data.items');
      }
    } else {
      console.log('Unexpected response format:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    }
  } else {
    console.log('Empty response data');
  }
})
.catch(error => {
  console.error('\nAPI Request Error:');
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Status:', error.response.status);
    console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    console.error('Data:', JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message);
  }
  console.error('Configuration:', JSON.stringify(error.config, null, 2));
});
