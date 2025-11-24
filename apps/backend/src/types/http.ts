export type ApiResponse<T> = {
  success: true;
  data: T;
  error?: undefined;
} | {
  success: false;
  data?: undefined;
  error: string;
};
