import type { IndexedDBRepository } from '../domain/db-interface';

const DB_NAME = 'todo-db';
const DB_VERSION = 1;

const openDB = (storeName: string): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = () => reject(request.error);
  });
};

export const implIndexedDBRepository = (
  storeName: string
): IndexedDBRepository => ({
  getAll: <T>(_storeName: string = storeName): Promise<T[]> => {
    return openDB(storeName).then((db) => {
      return new Promise((resolve, reject) => {
        const request = db
          .transaction(storeName, 'readonly')
          .objectStore(storeName)
          .getAll();

        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
      });
    });
  },

  replaceAll: <T>(items: T[]): Promise<void> => {
    return openDB(storeName).then((db) => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          items.forEach((item) => store.put(item));
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    });
  },
});
