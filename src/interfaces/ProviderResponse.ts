export interface ProviderResponse<T> {
  data: T;
  error?: {
    message: string;
    details: any;
  };
}
