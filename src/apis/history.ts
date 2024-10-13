import { doc, getDoc, writeBatch, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { ICashCheckForm, ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from '../utils/formatter';

export const historyApi = {
  async getHistoryData<T>(uid: string, date: string, collectionName: string) {
    const ref = doc(doc(db, uid, collectionName), 'data', date);
    const res = (await getDoc(ref)).data();
    return (res?.['data'] as T[]) ?? [];
  },

  async getSalesHistory(uid: string, date: string = formatter.formatDate(new Date())): Promise<ISalesHistory[]> {
    return (await this.getHistoryData<ISalesHistory>(uid, date, 'salesData')).sort((a, b) => a.number - b.number);
  },

  async getCashCheckHistory(uid: string, date: string) {
    const res = await this.getHistoryData<ICashCheckForm>(uid, date, 'cashCheckData');
    return res.sort((a, b) => a.number - b.number);
  },

  async setSalesHistory({ uid, salesHistory }: { uid: string; salesHistory: ISalesHistory }) {
    const ref = doc(doc(db, uid, 'salesData'), 'data', salesHistory.date);
    if (salesHistory.number === 1) {
      await setDoc(ref, {
        data: arrayUnion(salesHistory),
      });
    } else {
      await updateDoc(ref, {
        data: arrayUnion(salesHistory),
      });
    }
  },

  async getSalesDate(uid: string) {
    const ref = doc(db, uid, 'salesData');
    const res = (await getDoc(ref)).data()?.dates ?? [];
    return res.sort((a: string, b: string) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
  },

  async updateSalesHistory({ uid, updateData }: { uid: string; updateData: ISalesHistory[] }) {
    const date = updateData[0].date;
    const ref = doc(doc(db, uid, 'salesData'), 'data', date);
    await updateDoc(ref, { data: updateData });
  },

  async setCashCheckHistory({ uid, cashCheck }: { uid: string; cashCheck: ICashCheckForm }) {
    const date = formatter.formatDate(new Date());
    const newRef = doc(doc(db, uid, 'cashCheckData'), 'data', date);
    try {
      await updateDoc(newRef, { data: arrayUnion(cashCheck) });
    } catch {
      try {
        await setDoc(newRef, { data: [cashCheck] });
      } catch (e) {
        if (e instanceof Error) throw e;
      }
    }
  },

  async getCashCheckDate(uid: string) {
    const ref = doc(db, uid, 'cashCheckData');
    const res = (await getDoc(ref))?.data()?.dates ?? [];
    return res.sort((a: string, b: string) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
  },

  async setCashCheckDate(uid: string) {
    const date = formatter.formatDate(new Date());
    const ref = doc(db, uid, 'cashCheckData');
    try {
      await updateDoc(ref, { dates: arrayUnion(date) });
    } catch {
      try {
        await setDoc(ref, { dates: [date] });
      } catch (e) {
        if (e instanceof Error) throw e;
      }
    }
  },

  async setSalesDate(uid: string) {
    const ref = doc(db, uid, 'salesData');
    try {
      await updateDoc(ref, { dates: arrayUnion(formatter.formatDate(new Date())) });
    } catch {
      try {
        await setDoc(ref, { dates: [formatter.formatDate(new Date())] });
      } catch (e) {
        if (e instanceof Error) throw e;
      }
    }
  },

  async getMultipleSalesHistory(uid: string, dateArray: string[]): Promise<ISalesHistory[][]> {
    const refArray = dateArray.map((date) => doc(doc(db, uid, 'salesData'), 'data', date));
    const resArray = await Promise.all(
      refArray.map(async (ref) => {
        const res = await getDoc(ref);
        return res.data()?.['data'] as ISalesHistory[];
      }),
    );
    return resArray;
  },

  async updateSalesQuantity({ uid, numbers, quantities }: { uid: string; numbers: string[]; quantities: number[] }) {
    const refArray = numbers.map((number) => doc(doc(db, 'userData', uid), 'products', number));
    const batch = writeBatch(db);
    quantities.forEach((quantity, index) => batch.update(refArray[index], { salesQuantity: quantity }));
    await batch.commit();
  },

  async createSalesStatisticDoc(uid: string) {
    const ref = doc(db, 'salesStatistic', uid);
    await setDoc(ref, {});
  },
};
