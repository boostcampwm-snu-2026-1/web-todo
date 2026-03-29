export async function optimistic<T>({
  optimisticFn,
  asyncFn,
  rollbackFn,
}: {
  optimisticFn: () => void;
  asyncFn: () => Promise<T extends { state: string } ? T : never>;
  rollbackFn: () => void | Promise<void>;
}) {
  optimisticFn();
  const result = await asyncFn();
  if (result.state === 'error') {
    await rollbackFn();
  }
  return result;
}
