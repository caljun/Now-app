import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapViewComponent() {
  const [location, setLocation] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // 関学構内の緯度経度範囲（西宮上ケ原キャンパス）
  const CAMPUS_BOUNDS = {
    north: 34.7986,
    south: 34.7940,
    east: 135.3775,
    west: 135.3725,
  };

  const isInsideCampus = (lat, lng) => {
    return (
      lat >= CAMPUS_BOUNDS.south &&
      lat <= CAMPUS_BOUNDS.north &&
      lng >= CAMPUS_BOUNDS.west &&
      lng <= CAMPUS_BOUNDS.east
    );
  };

  const updateLocationToServer = async (coords) => {
    const token = await AsyncStorage.getItem('token');
    await fetch('https://now-backend-wah5.onrender.com/api/users/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    });
  };

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch('https://now-backend-wah5.onrender.com/api/friends/locations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setFriends(data);
    } else {
      console.warn('想定外のレスポンス', data);
    }
  };

  useEffect(() => {
    let interval;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('位置情報の許可が必要です');
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
      await updateLocationToServer(current.coords);
      await fetchFriends();

      // 定期更新（10秒ごと）
      interval = setInterval(async () => {
        const updated = await Location.getCurrentPositionAsync({});
        setLocation(updated.coords);
        await updateLocationToServer(updated.coords);
        await fetchFriends();
      }, 10000); // ← 10秒（任意で変更可能）

      setLoading(false);
    })();

    return () => clearInterval(interval); // アンマウント時に停止
  }, []);

  if (loading || !location) {
    return <ActivityIndicator style={{ marginTop: 32 }} color="#fff" size="large" />;
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }}
    >
      {/* 自分の位置 */}
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="あなた"
        pinColor="blue"
      />

      {/* 構内にいる友達だけ表示 */}
      {friends
        .filter(friend => isInsideCampus(friend.latitude, friend.longitude))
        .map(friend => (
          <Marker
            key={friend.id}
            coordinate={{
              latitude: friend.latitude,
              longitude: friend.longitude,
            }}
            title={friend.name}
            pinColor="green"
          />
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
