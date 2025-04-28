import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddFriendScreen() {
  const [friendId, setFriendId] = useState('');
  const [myId, setMyId] = useState('');

  // トークンから自分のIDを取り出す
  useEffect(() => {
    const loadUserId = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('ログインが必要です');
        return;
      }

      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const json = JSON.parse(atob(base64));
        setMyId(json.id);
      } catch (err) {
        console.error('トークン解析エラー', err);
      }
    };

    loadUserId();
  }, []);

  const handleAddFriend = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('ログインが必要です');
      return;
    }

    try {
      const res = await fetch('https://now-backend-wah5.onrender.com/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendId })
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('成功', '友達を追加しました');
        setFriendId('');
      } else {
        Alert.alert('エラー', data.error || '追加に失敗しました');
      }
    } catch (err) {
      console.error('通信エラー', err);
      Alert.alert('通信エラー', 'サーバーと接続できませんでした');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="友達追加" />
      <View style={{ height: 100 }} />

      {myId ? <Text style={styles.myId}>あなたの Now ID：{myId}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="相手のNow IDを入力"
        placeholderTextColor="#aaa"
        value={friendId}
        onChangeText={setFriendId}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
        <Text style={styles.buttonText}>追加する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  myId: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderColor: '#333',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
