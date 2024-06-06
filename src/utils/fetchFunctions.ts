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
} from 'firebase/firestore';
import { db } from '../firebase';
import { ICashCheckForm, ICategory, IProduct, ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from './formatter';

const getData = async <T>(uid: string, collectionName: string): Promise<T[]> => {
  const ref = collection(doc(db, 'userData', uid), collectionName);
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
  const ref = collection(doc(db, collectionName, uid), date);
  const querySortedByNumber = query(ref, orderBy('number', 'asc'));
  const res: QuerySnapshot<DocumentData> = await getDocs(querySortedByNumber);
  return res.docs.map((doc) => doc.data() as T) ?? [];
};

export const getSalesHistory = async (
  uid: string,
  date: string = formatter.formatDate(new Date()),
): Promise<ISalesHistory[]> => {
  return await getHistoryData<ISalesHistory>(uid, date, 'salesData');
};

export const getCashCheckHistory = async (uid: string, date: string) => {
  return await getHistoryData<ICashCheckForm>(uid, date, 'cashCheckData');
};

export const setSalesHistory = async (
  uid: string,
  date: string = formatter.formatDate(new Date()),
  salesHistory: ISalesHistory,
) => {
  const ref = doc(doc(db, 'salesData', uid), date, salesHistory.number.toString());
  await setDoc(ref, salesHistory);
};

export const setData = async ({ uid, data }: { uid: string; data: IProduct[] | ICategory[] }) => {
  const dataType = 'price' in data[0] ? 'products' : 'categories';
  const refArray = data.map((eachData) => {
    return doc(doc(db, 'userData', uid), dataType, eachData.number.toString());
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
  const refArray = numberArray.map((number) => {
    return doc(doc(db, 'userData', uid), type, number.toString());
  });
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
  const refArray = numbers.map((number) => doc(doc(db, 'userData', uid), type, number.toString()));
  const batch = writeBatch(db);
  refArray.forEach((ref) => batch.delete(ref));
  await batch.commit();
};

export const getSalesDate = async (uid: string, sort: 'asc' | 'desc') => {
  const ref = doc(db, 'salesData', uid);
  return (await getDoc(ref))?.data()?.dates.sort((a: string, b: string) => {
    if (a > b) return sort === 'asc' ? 1 : -1;
    if (a < b) return sort === 'asc' ? -1 : 1;
    return 0;
  });
};

export const updateSalesHistory = async (
  uid: string,
  date: string,
  number: string,
  updateData: Partial<ISalesHistory>,
) => {
  const ref = doc(doc(db, 'salesData', uid), date, number);
  await updateDoc(ref, updateData);
};

export const setCashCheckHistory = async (uid: string, date: string, cashCheck: ICashCheckForm) => {
  const newRef = doc(doc(db, 'cashCheckData', uid), date, cashCheck.number.toString());
  await setDoc(newRef, cashCheck);
};

export const getCashCheckDate = async (uid: string) => {
  const ref = doc(db, 'cashCheckData', uid);
  const res = (await getDoc(ref))?.data()?.dates ?? [];
  return res.sort((a: string, b: string) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
};

export const setCashCheckDate = async (uid: string) => {
  const ref = doc(db, 'cashCheckData', uid);
  const data = await getCashCheckDate(uid);
  const newData = { dates: [...data, formatter.formatDate(new Date())] };
  await setDoc(ref, newData);
};

export const setSalesDate = async (uid: string) => {
  const ref = doc(db, 'salesData', uid);
  const data = await getSalesDate(uid, 'asc');
  const newData = { dates: [...data, formatter.formatDate(new Date())] };
  await setDoc(ref, newData);
};

export const getMultipleSalesHistory = async (uid: string, dateArray: string[]): Promise<ISalesHistory[][]> => {
  const refArray = dateArray.map((date) => collection(doc(db, 'salesData', uid), date));
  const resArray = await Promise.all(
    refArray.map(async (ref) => {
      const res = await getDocs(ref);
      return res.docs.map((doc) => doc.data() as ISalesHistory);
    }),
  );
  return resArray;
};
