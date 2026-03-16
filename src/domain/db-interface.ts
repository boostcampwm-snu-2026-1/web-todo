export type IndexedDBRepository = {
  getAll: <T>() => Promise<T[]>;
  replaceAll: <T>(items: T[]) => Promise<void>;
};
