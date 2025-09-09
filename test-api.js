// Simple test script to verify API integration
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080'; // Gateway URL

async function testAPI() {
  console.log('Testing Hive API Integration...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      username: 'testuser123',
      email: 'test123@example.com',
      password: 'password123'
    });
    console.log('✅ Registration successful:', registerResponse.status);

    // Test 2: Login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: 'testuser123',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    const token = loginResponse.data.accessToken;
    console.log('Token received:', token.substring(0, 20) + '...');

    // Test 3: Get current user
    console.log('\n3. Testing get current user...');
    const userResponse = await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get user successful:', userResponse.data);

    // Test 4: Send a message
    console.log('\n4. Testing send message...');
    const messageResponse = await axios.post(`${API_BASE_URL}/api/chat/send`, {
      conversationId: 'test-conversation-123',
      content: 'Hello from React Native app!',
      messageType: 'TEXT'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Send message successful:', messageResponse.status);

    // Test 5: Create a group
    console.log('\n5. Testing create group...');
    const groupResponse = await axios.post(`${API_BASE_URL}/api/chat/groups`, {
      name: 'Test Group',
      description: 'A test group created from React Native app',
      memberIds: new Set(['user1', 'user2'])
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Create group successful:', groupResponse.data);

    console.log('\n🎉 All API tests passed! The React Native app can successfully communicate with the backend services.');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testAPI();
