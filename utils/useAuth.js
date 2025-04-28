// utils/useAuth.js
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(json => {
      if (json) setUser(JSON.parse(json));
    });
  }, []);

  return { user };
};
