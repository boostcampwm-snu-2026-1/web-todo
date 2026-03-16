import type { DateRepository } from '../domain/date-interface';

export const implDateUsecase = ({
  dateRepository,
}: {
  dateRepository: DateRepository;
}) => ({
  getNow: () => {
    const now = dateRepository.getNow();

    const weekday = now.toLocaleDateString('ko-KR', { weekday: 'long' });
    const month = now.toLocaleDateString('ko-KR', { month: 'long' });
    const day = now.getDate();

    return `${weekday}, ${month} ${day}일`;
  },
});
