import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ICategory, IProduct, ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from './formatter';

export const fetchProducts = async (uid: string): Promise<IProduct[]> => {
  const ref = collection(doc(db, 'userData', uid), 'products');
  const q = query(ref, where('display', '==', true));
  const res = (await getDocs(q)).docs?.map((doc) => doc.data() as IProduct);
  return res ?? [];
};

export const fetchCategories = async (uid: string): Promise<ICategory[]> => {
  const ref = collection(doc(db, 'userData', uid), 'categories');
  const q = query(ref, where('display', '==', true));
  const res = (await getDocs(q)).docs?.map((doc) => doc.data() as ICategory);
  return res ?? [];
};

export const fetchSalesHistory = async (
  uid: string,
  date: string = formatter.formatDate(new Date()),
): Promise<ISalesHistory[]> => {
  const ref = collection(doc(db, 'salesData', uid), date);
  const res = (await getDocs(ref)).docs?.map((doc) => doc.data() as ISalesHistory);
  return res ?? [];
};