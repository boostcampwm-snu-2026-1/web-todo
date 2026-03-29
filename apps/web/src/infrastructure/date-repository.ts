import type { DateRepository } from '../domain/date-interface';

export const implDateRepository = (): DateRepository => ({
  getNow: () => {
    return new Date();
  },
});
