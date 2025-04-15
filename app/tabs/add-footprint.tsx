import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

export default function AddFootprint() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [itemType, setItemType] = useState<string>('food');

  // DropDownPicker 状态
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'food', value: 'food' },
    { label: 'furniture', value: 'furniture' },
    { label: 'delivery', value: 'delivery' },
    { label: 'pet', value: 'pet' },
  ]);

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
      setLocation(locationData);
      Alert.alert(
        'Location obtained',
        `longitude:${locationData.longitude.toFixed(4)}\nlatitude:${locationData.latitude.toFixed(4)}`
      );
    } catch (error) {
      console.error('Failed to get location:', error);
      Alert.alert('error', 'Unable to get location information');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission error', 'Require camera permissions');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        Alert.alert('Photo success', 'Picture loaded');
      }
    } catch (error) {
      console.error('Photo failure:', error);
      Alert.alert(
        'Photo failure',
        'Do you want to select pictures from the album?',
        [
          { text: 'cancel', style: 'cancel' },
          { text: 'Select from album', onPress: handlePickFromLibrary },
        ],
        { cancelable: true }
      );
    }
  };

  const handlePickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission error', 'Requires album access');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        Alert.alert('Picture selection successful');
      }
    } catch (error) {
      console.error('Selection failure:', error);
      Alert.alert('error', 'Couldn not get the picture from the album');
    }
  };

  const handleSubmit = async () => {
    if (!location || !note.trim()) {
      Alert.alert('hint', 'Please fill in the remarks and obtain the location');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    const newFootprint = {
      location: `${location.latitude},${location.longitude}`,
      photoUrl: image || '',
      notes: note.trim(),
      itemType,
      timestamp: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem('@footprints');
      let footprints = [];

      // 确保从 AsyncStorage 获取的数据是有效的 JSON 数组
      if (existingData) {
        try {
          footprints = JSON.parse(existingData);
          if (!Array.isArray(footprints)) {
            footprints = []; // 如果不是数组，重置为空数组
          }
        } catch (error) {
          console.error('Parsing AsyncStorage data fails. Procedure:', error);
          footprints = []; // 解析失败时重置为空数组
        }
      }

      // 更新足迹数据
      const updated = [...footprints, newFootprint];

      await AsyncStorage.setItem('@footprints', JSON.stringify(updated));
      Alert.alert('successful', 'Footprint saved');

      setLocation(null);
      setImage(null);
      setNote('');
      setItemType('food');
    } catch (error) {
      console.error('fail to submit:', error);
      Alert.alert('error', 'Failed to submit, please try again later');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={[1]} // 使用空数据或实际的数据列表
          keyExtractor={() => 'key'}
          renderItem={() => (
            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={getLocation}>
                <Text style={styles.buttonText}>📍 GetPosition</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>📷 Take a picture</Text>
              </TouchableOpacity>

              {image && (
                <TouchableOpacity onPress={() => Alert.alert('hint', 'To change the picture, take a new photo or select from the album')}>
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
              )}

              <TextInput
                placeholder="📝 remark..."
                value={note}
                onChangeText={setNote}
                style={styles.input}
                multiline
              />

              <View style={{ zIndex: 1000, marginBottom: 20 }}>
                <Text style={styles.pickerLabel}>Select item type:</Text>
                <DropDownPicker
                  open={open}
                  value={itemType}
                  items={items}
                  setOpen={setOpen}
                  setValue={setItemType}
                  setItems={setItems}
                  placeholder="Please select item type"
                  style={{ borderColor: '#FFA500' }}
                  dropDownContainerStyle={{ borderColor: '#FFA500' }}
                />
              </View>

              <View style={styles.submitButtonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#FFA500" />
                ) : (
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>✅ Submit footprint</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    marginVertical: 10,
    fontSize: 16,
    padding: 8,
    borderColor: '#FFA500',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF7F32',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF7F32',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
});
