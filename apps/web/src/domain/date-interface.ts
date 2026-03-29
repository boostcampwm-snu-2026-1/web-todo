export type DateRepository = {
  getNow: () => Date;
};

export type DateUsecase = {
  getNow: () => string;
};
