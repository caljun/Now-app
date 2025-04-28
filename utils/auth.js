// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export async function getCurrentUser() {
  const json = await AsyncStorage.getItem('user');
  return json ? JSON.parse(json) : null;
}

export async function requireLogin() {
  const user = await getCurrentUser();
  if (!user) {
    alert('ログインが必要です');
    router.replace('/login');
  }
}

export const logout = async () => {
  await AsyncStorage.multiRemove(['token', 'user']);
  router.replace('/login');
};
