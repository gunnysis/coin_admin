import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/firebase'; // Firestore 인스턴스
import { collection, getDocs, query, where } from 'firebase/firestore';


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const q = query(collection(db, 'users'), where('name', '==', username));
      const querySnapshot = await getDocs(q);

      // ✅ 네트워크 오류 등으로 캐시만 있을 경우
      if (querySnapshot.metadata.fromCache) {
        Alert.alert('ios 에뮬레이터 사용 불가', '아이폰을 사용해주세요.');
        return; // 🚫 캐시 결과로 로그인 처리하지 않음
      }

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        // 🔐 세션 저장
        await AsyncStorage.setItem('user_id', userId);


        // ✅ 페이지 이동
        router.push('/(tabs)');
      } else {
        Alert.alert('로그인 실패', '해당 이름의 사용자가 존재하지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('오류 발생', '로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ThemedText className="text-2xl font-bold mb-5">
        팝스타코노 관리자 로그인
      </ThemedText>
      <View className="w-4/5 p-5 rounded-xl bg-gray-100 shadow-md">
        <View className="mb-5 p-2 rounded bg-white border border-gray-300">
          <TextInput
            className="w-full h-10 px-2 text-base bg-white"
            placeholder="이름"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <TouchableOpacity
          className="mt-5 p-3 rounded bg-green-500"
          onPress={handleLogin}
        >
          <ThemedText className="text-base font-bold text-white text-center">
            로그인
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

