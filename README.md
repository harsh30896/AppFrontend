# Hive Chat Mobile App

## Overview
Hive Chat is a React Native mobile application that provides real-time messaging capabilities, group chats, and user management. The app connects to a Spring Boot microservices backend for authentication, messaging, and notifications.

## Features
- User authentication (login/register)
- Real-time private messaging
- Group chat creation and management
- Message status tracking (sent, delivered, read)
- Typing indicators
- Push notifications
- User profile management

## Tech Stack
- React Native with Expo
- TypeScript
- React Navigation for routing
- Axios for API requests
- STOMP/SockJS for WebSocket communication
- AsyncStorage for local storage
- React Native Vector Icons for UI elements

## Project Structure
```
src/
  ├── components/       # Reusable UI components
  ├── contexts/         # React contexts (Auth)
  ├── navigation/       # Navigation configuration
  ├── screens/          # App screens
  └── services/         # API and business logic services
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HiveApp
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure the backend API URL
Edit `src/services/api.ts` to point to your backend server.

### Running the App

```bash
npm start
# or
yarn start
```

This will start the Expo development server. You can then run the app on:
- iOS simulator (macOS only): Press `i` in the terminal
- Android emulator: Press `a` in the terminal
- Physical device: Scan the QR code with the Expo Go app

## Backend Configuration

The app is designed to work with the Hive Chat backend microservices. Make sure the backend is properly configured and running before using the app.

The backend services include:
- Authentication Service
- User Service
- Chat Service
- Notification Service
- API Gateway

## WebSocket Configuration

The app uses STOMP over WebSocket for real-time communication. The WebSocket connection is established through the Chat Service at the `/ws` endpoint.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
