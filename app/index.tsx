import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      {/* 左上角图标 */}
      <Image source={require('../assets/images/icon.png')} style={styles.icon} />

      <View style={styles.container}>
        

        <View style={styles.buttonContainer}>
          <Animated.View style={[styles.buttonWrapper, { transform: [{ translateY: floatAnim }] }]}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => router.push('/tabs/add-footprint')}
            >
              <Text style={styles.buttonText}>Add footprint</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.buttonWrapper, { transform: [{ translateY: floatAnim }] }]}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => router.push('/tabs/my-footprints')}
            >
              <Text style={styles.buttonText}>Check my tracks</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  icon: {
    position: 'absolute',
    top: 40, 
    left: 20, 
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 40,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  buttonWrapper: {
    marginHorizontal: 10,
  },
  customButton: {
    backgroundColor: '#F5DEB3', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
