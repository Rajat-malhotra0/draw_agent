// Simple test script to verify the server is running
const testUrl = 'http://localhost:3000/api/health';

console.log('🧪 Testing server at:', testUrl);

fetch(testUrl)
  .then(res => res.json())
  .then(data => {
    console.log('✅ Server is running!');
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.log('❌ Server is not responding');
    console.log('Error:', err.message);
  });
