// app/mypage.jsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { router } from 'expo-router';
import { logout } from '../utils/auth';
import MapViewComponent from '../components/MapViewComponent'; // ← 追加

export default function MypageScreen() {
  return (
    <View style={styles.container}>
      <Header title="マイページ" />

      {/* 地図表示部分 */}
      <View style={styles.mapPlaceholder}>
        <MapViewComponent />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/add-friend')}
        >
          <Text style={styles.buttonText}>友達を追加</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
          <Text style={styles.buttonText}>ログアウト</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.friendSection}>
        <Text style={styles.friendTitle}>構内にいる友達一覧</Text>
        {/* ↓ここに動的にフレンドリストを入れる予定 */}
        <View style={styles.friendList}>
          <Text style={{ color: '#aaa' }}>まだ友達がいません</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  mapPlaceholder: {
    height: '40%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden', // MapView に角丸を適用するため
  },
  actions: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#444',
    borderWidth: 1,
  },
  logout: {
    backgroundColor: '#300000',
    borderColor: '#800000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  friendSection: {
    flex: 1,
  },
  friendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  friendList: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
});
