import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import ReloadIcon from './components/ReloadIcon'
import WeatherDetails from './components/WeatherDetails'
import {colors} from './utils/index'

const WEATHER_API_KEY = 'e93864dea4ca4cf127549370a2417669'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitSystem, setUnitSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [unitSystem])

  async function load() {
    setCurrentWeather(null)
    try{
      let { status } = await Location.requestPermissionsAsync()

      if(status !== 'granted'){
        setErrorMessage('Access to location is needed to run the app')
        return 
      }
      const location = await Location.getCurrentPositionAsync()
      const { latitude, longitude } = location.coords
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`
    
      const response = await fetch(weatherUrl)
      const result = await response.json()

      if(response.ok){
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }
    } catch(error){
      setErrorMessage(error.message)
    }
  }
  
  if(currentWeather){
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style = {styles.main}>
          <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
          <ReloadIcon load={load}/>
          <WeatherInfo currenWeather={currentWeather} />
        </View>
        <WeatherDetails currentWether={currentWeather} unitSystem={unitSystem}/>
      </View>
    );
  } else if(errorMessage){
    return (
      <View style={styles.container}>
        <ReloadIcon load={load}/>
        <Text style={{textAlign: 'center', color: 'black'}}>Oh no, {errorMessage}, :(</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.activity} size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    justifyContent: 'center',
    flex: 1,
  },
  activity: {
    top: 50,
  },
});
