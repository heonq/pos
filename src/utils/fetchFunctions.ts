import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ICategory, IProduct } from '../Interfaces/DataInterfaces';

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
