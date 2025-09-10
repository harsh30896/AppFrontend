import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChatDetail: { conversationId: string; conversationName?: string };
  CreateGroup: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <RootStack.Screen 
              name="Main" 
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="ChatDetail" 
              component={ChatDetailScreen}
              options={({ route }) => ({
                title: route.params.conversationName || 'Chat',
              })}
            />
            <RootStack.Screen 
              name="CreateGroup" 
              component={CreateGroupScreen}
              options={{
                title: 'Create Group',
              }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" options={{ headerShown: false }}>
            {() => (
              <AuthStack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <AuthStack.Screen name="Login" component={LoginScreen} />
                <AuthStack.Screen name="Register" component={RegisterScreen} />
              </AuthStack.Navigator>
            )}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;