export const createRandomString = () => {
  const now = new Date();
  const timeString = now.toISOString().replace(/[-:.TZ]/g, ''); // 20240329013000 형태
  const randomPart = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자열
  const finalString = `${timeString}_${randomPart}`;

  return finalString;
};
