// app/_layout.jsx
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const isLoggedIn = !!token;
      const current = segments[0]; // 最初のセグメント取得（例: "login"）

      if (!isLoggedIn && current !== 'login' && current !== 'register') {
        router.replace('/login');
      }

      setLoading(false);
    };

    checkAuth();
  }, [segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
