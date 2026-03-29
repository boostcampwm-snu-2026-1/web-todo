export async function optimistic<T>({
  optimisticFn,
  asyncFn,
  rollbackFn,
  cleanUpFn,
}: {
  optimisticFn: () => void;
  asyncFn: () => Promise<T extends { state: string } ? T : never>;
  rollbackFn: () => void | Promise<void>;
  cleanUpFn?: () => void | Promise<void>;
}) {
  optimisticFn();
  const result = await asyncFn();
  if (cleanUpFn !== undefined) {
    await cleanUpFn();
  }
  if (result.state === 'error') {
    await rollbackFn();
  }
  return result;
}
