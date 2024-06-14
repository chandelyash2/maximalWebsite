import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as firebase from 'firebase/app';
import styles from '../css/styles';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        
      } else {
        setError('User not found after login.');
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(getErrorMessage(error.code)); // Handle errors with custom messages
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      default:
        return 'An error occurred. Please try again later.';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
      <Button title="Forgot Password" onPress={() => navigation.navigate('ForgotPassword')} />
    </View>
  );
};

export default Login;
