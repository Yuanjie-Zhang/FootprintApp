import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Footprint 类型定义
type Footprint = {
  timestamp: string;
  notes: string;
  photoUrl: string;
  location: string;
  itemType?: string;
};

export default function MyFootprints() {
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 加载足迹数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@footprints');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          // 支持单条对象或数组
          const parsedData: Footprint[] = Array.isArray(parsed) ? parsed : [parsed];
          setFootprints(parsedData.reverse()); // 最近的显示在前
        }
      } catch (error) {
        console.error('Footprint loading failure:', error);
        Alert.alert('error', 'Unable to load footprint data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 删除足迹
  const handleDelete = (timestamp: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this footprint?', [
      { text: 'cancel', style: 'cancel' },
      {
        text: 'delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // 使用过滤函数，确保删除指定时间戳的足迹
            const updated = footprints.filter((item) => item.timestamp !== timestamp);
            setFootprints(updated); // 更新状态
            await AsyncStorage.setItem('@footprints', JSON.stringify(updated)); // 存储更新后的数据
          } catch (err) {
            console.error('fail to delete:', err);
            Alert.alert('error', 'fail to delete');
          }
        },
      },
    ]);
  };

  // 打开图片预览
  const openImagePreview = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  // 渲染每一条足迹
  const renderItem = ({ item }: { item: Footprint }) => (
    <View style={styles.item}>
      <Text style={styles.note}>{item.notes || '(remark No)'}</Text>

      {item.photoUrl ? (
        <TouchableOpacity onPress={() => openImagePreview(item.photoUrl)}>
          <Image source={{ uri: item.photoUrl }} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <Text style={styles.noImage}>no photo</Text>
      )}

      <Text style={styles.type}>📦 Type: {item.itemType || 'not classified'}</Text>
      <Text style={styles.location}>📍 {item.location || 'Moving units at unknown location'}</Text>
      <Text style={styles.timestamp}>
        🕒 {new Date(item.timestamp).toLocaleString()}
      </Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.timestamp)}
      >
        <Text style={styles.deleteText}>🗑 Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {footprints.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: '#888' }}>No recorded footprints 👣</Text>
        </View>
      ) : (
        <FlatList
          data={footprints}
          keyExtractor={(item) => item.timestamp}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* 图片模态框 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  note: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  type: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  noImage: {
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  modalCloseText: {
    fontWeight: 'bold',
    color: '#000',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
});
