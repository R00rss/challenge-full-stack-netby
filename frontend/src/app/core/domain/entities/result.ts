export type Result<T> = {
  data?: T;
  success: boolean;
  errorMessage: string;
};
