export type TSuccess = {
  success: boolean;
  data: any;
};

export const success = (_data: any): TSuccess => ({
  success: true,
  data: _data,
});
