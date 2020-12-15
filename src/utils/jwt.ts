import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Either, Left, Right } from 'purify-ts/Either';
import { TErreur, erreur } from './erreurs';

export type TjwtDecode = {
  userId: string;
  iat: number;
  exp: number;
};

export type TjwtError = {
  name: string;
  message: string;
  expiredAt: number;
};

export type TjwtErreurOuId = Either<TjwtError, TjwtDecode>;

export const encodeToken = (userId: string): string =>
  jwt.sign(
    {
      userId: userId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.TOKEN_DUREE }
  );

export const decodeToken = (token: string): TjwtErreurOuId =>
  <any>(
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decode) =>
      err ? Left(erreur('decodeToken', err)) : Right(decode)
    )
  );
