# Overview

Hive Chat is a React Native mobile application built with Expo that provides real-time messaging capabilities, group chats, and user management. The app is designed as a modern chat platform with features like private messaging, group creation, user authentication, and real-time communication through WebSocket connections. The application connects to a Spring Boot microservices backend architecture for authentication, user management, chat services, and notifications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The app follows a component-based React Native architecture with TypeScript, utilizing Expo for cross-platform development (iOS, Android, and Web). The frontend is structured around several key architectural patterns:

- **Context-based State Management**: Uses React Context API for global state management with separate contexts for authentication (AuthContext), chat functionality (ChatContext), and theming (ThemeContext)
- **Navigation Structure**: Implements React Navigation with stack and tab navigators, supporting authenticated and unauthenticated flows
- **Component Organization**: Follows a modular component structure with reusable UI components (Button, Input, LoadingSpinner) and feature-specific components (MessageBubble, chat components)
- **Theme System**: Implements a comprehensive dark theme system with centralized color, typography, and spacing definitions

## Backend Integration
The app is designed to work with a microservices backend architecture:

- **Service Discovery**: Uses Eureka Server for service registration and discovery
- **API Gateway**: Routes requests through a gateway service running on port 8080
- **Authentication Service**: Handles user login/registration on port 8081
- **User Service**: Manages user profiles and data on port 8082
- **Chat Service**: Handles messaging and WebSocket connections on port 8083
- **Notification Service**: Manages push notifications on port 8084

## Real-time Communication
The chat functionality is built around WebSocket connections using STOMP protocol:

- **WebSocket Management**: Automatic connection management with reconnection logic
- **Message Handling**: Real-time message delivery, typing indicators, and presence updates
- **Event System**: Publisher-subscriber pattern for handling various chat events

## Data Storage
The app uses AsyncStorage for local data persistence:

- **Token Management**: Secure storage of JWT access and refresh tokens
- **User Preferences**: Theme settings and user preferences
- **Offline Support**: Local caching of user data and recent messages

## Authentication & Authorization
Implements JWT-based authentication with token refresh mechanisms:

- **Token Interceptors**: Automatic token attachment to API requests
- **Refresh Logic**: Handles token expiration and refresh workflows
- **Secure Storage**: Uses AsyncStorage for token persistence

# External Dependencies

## Core Framework Dependencies
- **React Native with Expo**: Cross-platform mobile development framework
- **React Navigation**: Navigation library for screen routing and tab navigation
- **TypeScript**: Type safety and enhanced developer experience

## UI and Styling
- **Expo Linear Gradient**: Gradient backgrounds and visual effects
- **React Native Vector Icons**: Icon library for UI elements
- **Expo Vector Icons**: Additional icon sets including Ionicons
- **React Native Safe Area Context**: Safe area handling for different device screens

## Communication and Networking
- **Axios**: HTTP client for REST API communication
- **@stomp/stompjs**: WebSocket communication using STOMP protocol
- **sockjs-client**: WebSocket fallback and compatibility layer

## Local Storage and State
- **@react-native-async-storage/async-storage**: Local data persistence
- **React Native Gesture Handler**: Touch gesture handling
- **React Native Reanimated**: Advanced animations and interactions

## Notifications
- **Expo Notifications**: Push notification handling and management

## Development and Build Tools
- **@babel/core**: JavaScript compilation and transformation
- **@expo/ngrok**: Development tunneling for testing
- **@expo/metro-runtime**: Metro bundler runtime for React Native

## Backend Services (External)
- **Spring Boot Microservices**: Backend API services
- **Eureka Server**: Service discovery and registration
- **Redis**: Caching and session management (optional)
- **PostgreSQL/Database**: User and message data storage (backend)
- **WebSocket Server**: Real-time communication infrastructure