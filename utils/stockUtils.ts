import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

export interface StockApplication {
  stockName: string;
  stockCreatedAt: string;
  userName: string;
  memo: string;
  status: string;
  id: string;
}

export const initialStockApplication: StockApplication = {
  stockName: '',
  stockCreatedAt: '',
  userName: '',
  memo: '',
  status: '',
  id: '',
};

export const fetchStockRequests = (callback: (requests: StockApplication[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, "stocks"), (snapshot) => {
    const requests: StockApplication[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        stockName: data.name,
        stockCreatedAt: data.created_at.toDate().toLocaleString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
        }),
        userName: data.user_name,
        memo: data.memo,
        status: data.status,
      });
    });
    callback(requests);
  });

  return unsubscribe;
};