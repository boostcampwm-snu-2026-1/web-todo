export const createJsonStorage = (key) => {
  const get = () => {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const set = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return { get, set };
};
