import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StockApplication, fetchStockRequests, initialStockApplication } from '@/utils/stockUtils'; // ✨ 임포트 추가





export default function StockScreen() {
  const [stockApplication, setStockApplication] = useState(initialStockApplication);
  const [stockRequests, setStockRequests] = useState<StockApplication[]>([]); // 여기에 추가

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = fetchStockRequests((requests) => {
      setStockRequests(requests);
    });
    return () => unsubscribe();
  }, []);
  


  const handleApply = async () => {
    if (!stockApplication.stockName) {
      alert('재고명을 입력해주세요');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('user_id'); // AsyncStorage에서 user_id를 가져옴

      if (userId) {
        // users 컬렉션에서 userId와 일치하는 문서를 가져옴
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userName = userDoc.data().name;

          // stocks 컬렉션에 새 문서 추가
          await addDoc(collection(db, 'stocks'), {
            name: stockApplication.stockName,
            created_at: new Date(),
            memo: '',
            status: '요청',
            user_name: userName,
          });

          // 요청이 성공적으로 추가된 후, 입력 필드 초기화
          setStockApplication(initialStockApplication);
        } else {
          console.error('User document not found');
        }
      } else {
        console.error('User ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error applying for stock:', error);
    }
  };


  const handleInputChange = (field: keyof StockApplication, value: string) => {
    setStockApplication({ ...stockApplication, [field]: value });
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="py-20 my-10">
        <View className="flex-1 items-center justify-center bg-white px-4">
          <View className="w-4/5 p-5 bg-gray-100 rounded-xl shadow">
          <Text className="text-lg font-bold mb-2">재고 부족 신청</Text>
            <TextInput className="w-full h-10 px-3 mb-3 bg-white rounded text-base" placeholder="재고명" value={stockApplication.stockName} onChangeText={(text) => handleInputChange('stockName', text)} />
            <TouchableOpacity className="mt-4 p-3 bg-green-600 rounded" onPress={handleApply}>
              <Text className="text-white text-center text-base">신청</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-4 p-3 bg-yellow-600 rounded" onPress={() => router.push('/stock/update')}>
              <Text className="text-white text-center text-base">변경</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 p-5 bg-gray-100 rounded-xl shadow w-4/5">
            <Text className="text-base font-bold mb-2">재고 요청 정보</Text>
            <View className="border border-gray-300">
              <View className="flex-row border-b border-gray-300">
                <Text className="flex-1 p-2 bg-gray-200 font-bold">재고명</Text>
                <Text className="flex-1 p-2 bg-gray-200 font-bold">날짜</Text>
                <Text className="flex-1 p-2 bg-gray-200 font-bold">신청자</Text>
                <Text className="flex-1 p-2 bg-gray-200 font-bold">상태</Text>
                <Text className="flex-1 p-2 bg-gray-200 font-bold">메모</Text>
              </View>
              {stockRequests.map((request, index) => (
                <View key={index} className="flex-row border-b border-gray-300">
                  <Text className="flex-1 p-2">{request.stockName}</Text>
                  <Text className="flex-1 p-2">{request.stockCreatedAt}</Text>
                  <Text className="flex-1 p-2">{request.userName}</Text>
                  <Text className="flex-1 p-2">{request.status}</Text>
                  <Text className="flex-1 p-2">{request.memo}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

  );
}