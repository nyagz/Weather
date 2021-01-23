import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Location from 'expo-location';

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    load()
  , []})

  async function load() {
    try{
      let { status } = await Location.requestPermissionsAsync()

      if(status !== 'granted'){
        setErrorMessage('Access to location is needed to run the app')
        alert('Location has been allowed')
        return 
      } else {
        alert('Location has been allowed')
      }

      const location = await Location.getCurrentPositionAsync()
      const { longitude, latitude } = location.coords
      alert(`Latitude: ${latitude}, longitude: ${longitude}`)
      
    } catch{

    }
  }
  return (
    <View style={styles.container}>
      <Text>Hello from Teta</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
