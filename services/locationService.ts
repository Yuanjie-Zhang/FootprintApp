import * as Location from 'expo-location';
import axios from 'axios';

// 定时记录位置（每30分钟获取一次）
const getLocation = async () => {
  try {
    // 请求位置权限
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return null; // 如果没有权限，返回 null
    }
    
    // 获取当前位置
    const loc = await Location.getCurrentPositionAsync({});
    
    // 返回经纬度坐标
    return loc.coords;
  } catch (error) {
    console.log('Error getting location', error);
    return null; // 如果获取位置失败，返回 null
  }
};

// 发送位置到服务器或通过SMS发送（根据是否有数据连接）
type LocationData = Location.LocationObjectCoords; // 这里只需要坐标对象

const sendLocation = async (location: LocationData) => {
  try {
    // 如果有网络连接
    if (navigator.onLine) {
      // 通过 Web API 发送
      await axios.post('http://yourserver.com/api/location', location);
      console.log('Location sent via Web API');
    } else {
      // 如果没有网络连接，使用SMS发送
      const smsApiUrl = 'http://sms-gateway.com/send'; // SMS 网关
      await axios.post(smsApiUrl, { location });
      console.log('Location sent via SMS');
    }
  } catch (error) {
    console.error('Failed to send location', error);
  }
};

// 定时获取位置并发送（每30分钟一次）
const startPeriodicLocationTracking = () => {
  const intervalId = setInterval(async () => {
    // 获取当前位置
    const location = await getLocation();
    
    // 如果获取到位置，则发送
    if (location) {
      sendLocation(location);
    }
  }, 30 * 60 * 1000); // 每30分钟

  // 如果你需要停止定时器
}