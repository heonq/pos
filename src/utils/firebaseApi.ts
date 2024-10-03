import {
  collection,
  doc,
  DocumentData,
  getDocs,
  getDoc,
  orderBy,
  query,
  QuerySnapshot,
  writeBatch,
  updateDoc,
  setDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ICashCheckForm, ICategory, IProduct, ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from './formatter';

const getData = async <T>(uid: string, collectionName: string): Promise<T[]> => {
  const ref = collection(doc(db, uid, collectionName), 'data');
  const querySortedByNumber = query(ref, orderBy('number', 'asc'));
  const res: QuerySnapshot<DocumentData> = await getDocs(querySortedByNumber);
  return res.docs.map((doc) => doc.data() as T) ?? [];
};

export const getProducts = async (uid: string): Promise<IProduct[]> => {
  return await getData<IProduct>(uid, 'products');
};

export const getCategories = async (uid: string): Promise<ICategory[]> => {
  return await getData<ICategory>(uid, 'categories');
};

export const getHistoryData = async <T>(uid: string, date: string, collectionName: string) => {
  const ref = doc(doc(db, uid, collectionName), 'data', date);
  const res = (await getDoc(ref)).data();
  return (res?.['data'] as T[]) ?? [];
};

export const getSalesHistory = async (
  uid: string,
  date: string = formatter.formatDate(new Date()),
): Promise<ISalesHistory[]> => {
  return (await getHistoryData<ISalesHistory>(uid, date, 'salesData')).sort((a, b) => a.number - b.number);
};

export const getCashCheckHistory = async (uid: string, date: string) => {
  const res = await getHistoryData<ICashCheckForm>(uid, date, 'cashCheckData');
  return res.sort((a, b) => a.number - b.number);
};

export const setSalesHistory = async ({ uid, salesHistory }: { uid: string; salesHistory: ISalesHistory }) => {
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
};

export const setData = async ({ uid, data }: { uid: string; data: IProduct[] | ICategory[] }) => {
  const dataType = 'price' in data[0] ? 'products' : 'categories';
  const refArray = data.map((eachData) => {
    return doc(doc(db, uid, dataType), 'data', eachData.number.toString());
  });
  const batch = writeBatch(db);
  refArray.forEach((ref, index) => batch.set(ref, data[index]));
  await batch.commit();
};

export const updateChangedData = async ({
  uid,
  numberArray,
  changedData,
  type,
}: {
  uid: string;
  numberArray: number[];
  changedData: Partial<IProduct>[] | Partial<ICategory>[];
  type: 'products' | 'categories';
}): Promise<void> => {
  const batch = writeBatch(db);
  const refArray = numberArray.map((number) => doc(doc(db, uid, type), 'data', number.toString()));
  refArray.forEach((ref, index) => batch.update(ref, changedData[index]));
  await batch.commit();
};

export const deleteData = async ({
  uid,
  numbers,
  type,
}: {
  uid: string;
  numbers: number[];
  type: 'products' | 'categories';
}) => {
  const refArray = numbers.map((number) => doc(doc(db, uid, type), 'data', number.toString()));
  const batch = writeBatch(db);
  refArray.forEach((ref) => batch.delete(ref));
  await batch.commit();
};

export const getSalesDate = async (uid: string) => {
  const ref = doc(db, uid, 'salesData');
  const res = (await getDoc(ref)).data()?.dates ?? [];
  return res.sort((a: string, b: string) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
};

export const updateSalesHistory = async ({ uid, updateData }: { uid: string; updateData: ISalesHistory[] }) => {
  const date = updateData[0].date;
  const ref = doc(doc(db, uid, 'salesData'), 'data', date);
  await updateDoc(ref, { data: updateData });
};

export const setCashCheckHistory = async ({ uid, cashCheck }: { uid: string; cashCheck: ICashCheckForm }) => {
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
};

export const getCashCheckDate = async (uid: string) => {
  const ref = doc(db, uid, 'cashCheckData');
  const res = (await getDoc(ref))?.data()?.dates ?? [];
  return res.sort((a: string, b: string) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
};

export const setCashCheckDate = async (uid: string) => {
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
};

export const setSalesDate = async (uid: string) => {
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
};

export const getMultipleSalesHistory = async (uid: string, dateArray: string[]): Promise<ISalesHistory[][]> => {
  const refArray = dateArray.map((date) => doc(doc(db, uid, 'salesData'), 'data', date));
  const resArray = await Promise.all(
    refArray.map(async (ref) => {
      const res = await getDoc(ref);
      return res.data()?.['data'] as ISalesHistory[];
    }),
  );
  return resArray;
};

export const updateSalesQuantity = async ({
  uid,
  numbers,
  quantities,
}: {
  uid: string;
  numbers: string[];
  quantities: number[];
}) => {
  const refArray = numbers.map((number) => doc(doc(db, 'userData', uid), 'products', number));
  const batch = writeBatch(db);
  quantities.forEach((quantity, index) => batch.update(refArray[index], { salesQuantity: quantity }));
  await batch.commit();
};

export const createSalesStatisticDoc = async (uid: string) => {
  const ref = doc(db, 'salesStatistic', uid);
  await setDoc(ref, {});
};
