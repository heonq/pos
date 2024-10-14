import { collection, doc, DocumentData, getDocs, orderBy, query, QuerySnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { ICategory, IProduct } from '../Interfaces/DataInterfaces';

export const productsAndCategoryApi = {
  async getData<T>(uid: string, collectionName: string): Promise<T[]> {
    const ref = collection(doc(db, uid, collectionName), 'data');
    const querySortedByNumber = query(ref, orderBy('number', 'asc'));
    const res: QuerySnapshot<DocumentData> = await getDocs(querySortedByNumber);
    return res.docs.map((doc) => doc.data() as T) ?? [];
  },

  async getProducts(uid: string): Promise<IProduct[]> {
    return await this.getData<IProduct>(uid, 'products');
  },

  async getCategories(uid: string): Promise<ICategory[]> {
    return await this.getData<ICategory>(uid, 'categories');
  },

  async setData({ uid, data }: { uid: string; data: IProduct[] | ICategory[] }) {
    const dataType = 'price' in data[0] ? 'products' : 'categories';
    const refArray = data.map((eachData) => {
      return doc(doc(db, uid, dataType), 'data', eachData.number.toString());
    });
    const batch = writeBatch(db);
    refArray.forEach((ref, index) => batch.set(ref, data[index]));
    await batch.commit();
  },

  async updateChangedData({
    uid,
    numberArray,
    changedData,
    type,
  }: {
    uid: string;
    numberArray: number[];
    changedData: Partial<IProduct>[] | Partial<ICategory>[];
    type: 'products' | 'categories';
  }): Promise<void> {
    const batch = writeBatch(db);
    const refArray = numberArray.map((number) => doc(doc(db, uid, type), 'data', number.toString()));
    refArray.forEach((ref, index) => batch.update(ref, changedData[index]));
    await batch.commit();
  },

  async deleteData({ uid, numbers, type }: { uid: string; numbers: number[]; type: 'products' | 'categories' }) {
    const refArray = numbers.map((number) => doc(doc(db, uid, type), 'data', number.toString()));
    const batch = writeBatch(db);
    refArray.forEach((ref) => batch.delete(ref));
    await batch.commit();
  },
};
