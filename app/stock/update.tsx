// app/stock/update.tsx
import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StockApplication, fetchStockRequests, initialStockApplication } from '@/utils/stockUtils'; // ✨ 임포트 추가
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function UpdateScreen() {
  const [stockRequests, setStockRequests] = useState<StockApplication[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tempStatus, setTempStatus] = useState<string>('요청');
  const [tempMemo, setTempMemo] = useState<string>('');
  const [modalType, setModalType] = useState<'status' | 'memo' | null>(null);


  useEffect(() => {
    const unsubscribe = fetchStockRequests((requests) => {
      setStockRequests(requests);
    });
    return () => unsubscribe();
  }, []);

  const openStatusModal = (index: number) => {
    setSelectedIndex(index);
    setTempStatus(stockRequests[index].status);
    setModalType('status');
  };

  const openMemoModal = (index: number) => {
    setSelectedIndex(index);
    setTempMemo(stockRequests[index].memo);
    setModalType('memo');
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setModalType(null);
  };

  const applyStatusChange = async () => {
    if (selectedIndex === null) return;
    const updated = [...stockRequests];
    updated[selectedIndex].status = tempStatus;
    setStockRequests(updated);

    const requestToUpdate = updated[selectedIndex];
    const docRef = doc(db, "stocks", requestToUpdate.id);
    await updateDoc(docRef, {
      status: tempStatus
    });

    closeModal();
  };

  const applyMemoChange = async () => {
    if (selectedIndex === null) return;
    const updated = [...stockRequests];
    updated[selectedIndex].memo = tempMemo;
    setStockRequests(updated);

    const requestToUpdate = updated[selectedIndex];
    const docRef = doc(db, "stocks", requestToUpdate.id);
    await updateDoc(docRef, {
      memo: tempMemo
    });

    closeModal();
  };

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100">
        <View className="items-center justify-center py-10">
          <View className="w-4/5 p-5 bg-gray-100 rounded-xl shadow">
            <Text className="text-base font-bold mb-2">재고 요청 정보</Text>
            <View className="border border-gray-300">
              <View className="flex-row border-b border-gray-300 bg-gray-200">
                <Text className="flex-1 p-2 font-bold text-sm text-center">재고명</Text>
                <Text className="flex-1 p-2 font-bold text-sm text-center">신청날짜</Text>
                <Text className="flex-1 p-2 font-bold text-sm text-center">신청자</Text>
                <Text className="flex-1 p-2 font-bold text-sm text-center">신청상태</Text>
                <Text className="flex-1 p-2 font-bold text-sm text-center">메모</Text>
              </View>
              {stockRequests.map((request, index) => (
                <View key={index} className="flex-row border-b border-gray-300 items-center min-h-12 bg-white">
                  <Text className="flex-1 p-2 text-sm text-center">{request.stockName}</Text>
                  <Text className="flex-1 p-2 text-sm text-center">{request.stockCreatedAt}</Text>
                  <Text className="flex-1 p-2 text-sm text-center">{request.userName}</Text>
                  <TouchableOpacity
                    className="flex-1 p-2 bg-gray-100 rounded"
                    onPress={() => openStatusModal(index)}
                  >
                    <Text className="text-sm text-center">{request.status}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 p-2 bg-yellow-50 rounded"
                    onPress={() => openMemoModal(index)}
                  >
                    <Text className="text-sm text-center">{request.memo}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

{/* 상태 변경 모달 */}
      <Modal visible={modalType === 'status'} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-4 rounded-t-2xl">
            <Picker
              selectedValue={tempStatus}
              onValueChange={(value) => setTempStatus(value)}
              style={{ height: 160 }}
            >
              <Picker.Item label="요청" value="요청" />
              <Picker.Item label="구매중" value="구매중" />
              <Picker.Item label="중단" value="중단" />
              <Picker.Item label="도착" value="도착" />
            </Picker>

            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                className="flex-1 p-3 bg-gray-400 rounded"
                onPress={closeModal}
              >
                <Text className="text-white text-center">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 p-3 bg-blue-600 rounded"
                onPress={applyStatusChange}
              >
                <Text className="text-white text-center">선택 완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 메모 수정 모달 */}
      <Modal visible={modalType === 'memo'} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg shadow-md w-4/5">
            <Text className="text-lg font-bold mb-4">메모 수정</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-4"
              value={tempMemo}
              onChangeText={(text) => setTempMemo(text)}
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 p-2 rounded mr-2"
                onPress={closeModal}
              >
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 p-2 rounded"
                onPress={applyMemoChange}
              >
                <Text className="text-white">저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      

    </>
  );
}