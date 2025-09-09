#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:8080'; // Gateway URL
const AUTH_URL = 'http://localhost:8081'; // Direct Auth Service URL
const USER_URL = 'http://localhost:8082'; // Direct User Service URL
const CHAT_URL = 'http://localhost:8083'; // Direct Chat Service URL

async function testIntegration() {
    console.log('🚀 Testing Hive App Integration...\n');

    try {
        // Test 1: Auth Service - Registration
        console.log('1. Testing User Registration...');
        const registerResponse = await axios.post(`${AUTH_URL}/api/auth/register`, {
            username: 'testuser2',
            password: 'password123',
            email: 'test2@example.com'
        });
        console.log('✅ Registration successful');

        // Test 2: Auth Service - Login
        console.log('2. Testing User Login...');
        const loginResponse = await axios.post(`${AUTH_URL}/api/auth/login`, {
            username: 'testuser2',
            password: 'password123'
        });
        const token = loginResponse.data.accessToken;
        console.log('✅ Login successful, got JWT token');

        // Test 3: User Service - Get Current User
        console.log('3. Testing User Service...');
        const userResponse = await axios.get(`${USER_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ User service working, user ID:', userResponse.data.userId);

        // Test 4: Chat Service - Send Message
        console.log('4. Testing Chat Service...');
        const chatResponse = await axios.post(`${CHAT_URL}/api/chat/send`, {
            conversationId: 'conv-123',
            content: 'Hello from integration test!',
            messageType: 'TEXT'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Chat service working, message sent');

        // Test 5: Gateway Service - Test routing
        console.log('5. Testing Gateway Service...');
        const gatewayResponse = await axios.get(`${BASE_URL}/actuator/health`);
        console.log('✅ Gateway service working, status:', gatewayResponse.data.status);

        console.log('\n🎉 All tests passed! The Hive App backend is working correctly.');
        console.log('\n📱 Frontend Status:');
        console.log('- React Native app should be running on port 3000');
        console.log('- You can access it via Expo Go app or web browser');
        console.log('\n🔗 Service URLs:');
        console.log('- Eureka Server: http://localhost:8761');
        console.log('- Gateway Service: http://localhost:8080');
        console.log('- Auth Service: http://localhost:8081');
        console.log('- User Service: http://localhost:8082');
        console.log('- Chat Service: http://localhost:8083');
        console.log('- Notification Service: http://localhost:8084');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

testIntegration();
