import {
  collection,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  where,
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
  const res = (await getDocs(ref)).docs?.map((doc) => doc.data() as ISalesHistory);
  return res ?? [];
};

export const addProduct = async (uid: string, product: IProduct) => {
  const ref = doc(doc(db, 'userData', uid), 'products', product.number.toString());
  await setDoc(ref, product);
};
