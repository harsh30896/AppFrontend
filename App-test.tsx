import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  console.log('Simple App component rendering...');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Hive App!</Text>
      <Text style={styles.subtext}>If you can see this, the app is working!</Text>
    </View>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
});
