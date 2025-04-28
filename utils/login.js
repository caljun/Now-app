// utils/login.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email, password) {
  try {
    const res = await fetch('https://now-backend-wah5.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } else {
      return { success: false, error: data.error || 'ログインに失敗しました' };
    }
  } catch (err) {
    return { success: false, error: '通信エラーが発生しました' };
  }
}
