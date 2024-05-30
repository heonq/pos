import { collection, doc, DocumentData, getDocs, orderBy, query, QuerySnapshot, writeBatch } from 'firebase/firestore';
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

export const deleteProducts = async ({ uid, numbers }: { uid: string; numbers: number[] }) => {
  const refArray = numbers.map((number) => doc(doc(db, 'userData', uid), 'products', number.toString()));
  const batch = writeBatch(db);
  refArray.forEach((ref) => batch.delete(ref));
  await batch.commit();
};
