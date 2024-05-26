import { collection, doc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ICategory, IProduct, ISalesHistory } from '../Interfaces/DataInterfaces';
import formatter from './formatter';

export const fetchProducts = async (uid: string): Promise<IProduct[]> => {
  const ref = collection(doc(db, 'userData', uid), 'products');
  const q = query(query(ref, where('display', '==', true)), orderBy('number', 'asc'));
  const res = (await getDocs(q)).docs?.map((doc) => doc.data() as IProduct);
  return res ?? [];
};

export const fetchCategories = async (uid: string): Promise<ICategory[]> => {
  const ref = collection(doc(db, 'userData', uid), 'categories');
  const q = query(query(ref, where('display', '==', true)), orderBy('number', 'asc'));
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

export const addProduct = async (uid: string, product: IProduct) => {
  const ref = doc(doc(db, 'userData', uid), 'products', product.number.toString());
  await setDoc(ref, product);
};
