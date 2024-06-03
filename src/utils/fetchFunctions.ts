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
import { ICategory, IProduct, ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from './formatter';

const fetchData = async <T>(uid: string, collectionName: string): Promise<T[]> => {
  const ref = collection(doc(db, 'userData', uid), collectionName);
  const querySortedByNumber = query(ref, orderBy('number', 'asc'));
  const res: QuerySnapshot<DocumentData> = await getDocs(querySortedByNumber);
  return res.docs.map((doc) => doc.data() as T) ?? [];
};

export const fetchProducts = async (uid: string): Promise<IProduct[]> => {
  return await fetchData<IProduct>(uid, 'products');
};

export const fetchCategories = async (uid: string): Promise<ICategory[]> => {
  return await fetchData<ICategory>(uid, 'categories');
};

export const fetchSalesHistory = async (
  uid: string,
  date: string = formatter.formatDate(new Date()),
): Promise<ISalesHistory[]> => {
  const ref = collection(doc(db, 'salesData', uid), date);
  const q = query(ref, orderBy('number', 'asc'));
  const res = (await getDocs(q)).docs?.map((doc) => doc.data() as ISalesHistory);
  console.log('res', res);
  return res ?? [];
};

export const storeSalesHistory = async (
  uid: string,
  date: string = formatter.formatDate(new Date()),
  salesHistory: ISalesHistory,
) => {
  const ref = doc(doc(db, 'salesData', uid), date, salesHistory.number.toString());
  await setDoc(ref, salesHistory);
};

export const addData = async ({ uid, data }: { uid: string; data: IProduct[] | ICategory[] }) => {
  const dataType = 'price' in data[0] ? 'products' : 'categories';
  const refArray = data.map((eachData) => {
    return doc(doc(db, 'userData', uid), dataType, eachData.number.toString());
  });
  const batch = writeBatch(db);
  refArray.forEach((ref, index) => batch.set(ref, data[index]));
  await batch.commit();
};

export const updateChangedProducts = async ({
  uid,
  numberArray,
  changedData,
}: {
  uid: string;
  numberArray: number[];
  changedData: Partial<IProduct>[];
}): Promise<void> => {
  const batch = writeBatch(db);
  const refArray = numberArray.map((number) => {
    return doc(doc(db, 'userData', uid), 'products', number.toString());
  });
  refArray.forEach((ref, index) => batch.update(ref, changedData[index]));
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
