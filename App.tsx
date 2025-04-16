import * as Location from 'expo-location';
import { Alert } from 'react-native';

const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission error', 'Please enable location information permission');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const locationData: Location.LocationObjectCoords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      altitude: loc.coords.altitude || 0,
      accuracy: loc.coords.accuracy || 0,
      altitudeAccuracy: loc.coords.altitudeAccuracy || 0,
      heading: loc.coords.heading || 0,
      speed: loc.coords.speed || 0,
    };

    // 你可以在这里用 setLocation(locationData) 之类的
    Alert.alert(
      'Location obtained',
      `longitude: ${locationData.longitude.toFixed(4)}\nlatitude: ${locationData.latitude.toFixed(4)}`
    );
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Location error', e.message);
    } else {
      Alert.alert('Unknown error', 'Something went wrong while getting location');
    }
  }
};
