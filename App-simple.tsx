import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [message, setMessage] = React.useState('Hive App is Working!');
  
  const handlePress = () => {
    setMessage('Button Pressed! App is fully functional!');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>🚀 Hive Chat App</Text>
        <Text style={styles.subtitle}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Test Button</Text>
        </TouchableOpacity>
        <Text style={styles.info}>
          ✅ React Native Web is working{'\n'}
          ✅ Dark theme is active{'\n'}
          ✅ Touch interactions work{'\n'}
          ✅ Ready for full app features!
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#00ff88',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});
