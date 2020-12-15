import bcrypt from 'bcrypt';

export const generateHash = (password: string): string =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8));