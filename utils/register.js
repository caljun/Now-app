// utils/register.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function register(name, email, password, profilePhoto = '') {
  try {
    const res = await fetch('https://now-backend-wah5.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, profilePhoto })
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || '登録に失敗しました' };
    }

    // 登録後に自動ログイン
    const loginRes = await fetch('https://now-backend-wah5.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();

    if (loginRes.ok) {
      await AsyncStorage.setItem('token', loginData.token);
      await AsyncStorage.setItem('user', JSON.stringify(loginData.user));
      return { success: true };
    } else {
      return { success: false, error: '登録成功しましたが、ログインに失敗しました' };
    }
  } catch (err) {
    return { success: false, error: '通信エラーが発生しました' };
  }
}
