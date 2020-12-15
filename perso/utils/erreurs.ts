export type TErreur = {
  success: boolean;
  key: string;
  message: any;
};

export const erreur = (_key: string, _msg: any): TErreur => ({
  success: false,
  key: _key,
  message: _msg,
});
