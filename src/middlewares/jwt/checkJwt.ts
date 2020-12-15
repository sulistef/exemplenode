import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { erreur } from "../../utils/erreurs";
import { Maybe } from "purify-ts/Maybe";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token: Maybe<string> = Maybe.fromNullable(req.headers["authorization"]);
  let jwtPayload;

  try {
    token.isJust()
      ? token.map((jeton) => {
          jwtPayload = <any>jwt.verify(jeton, process.env.ACCESS_TOKEN_SECRET!);
          res.locals.jwtPayload = jwtPayload;
          next();
        })
      : res.status(401).send(erreur("checkJwt", "Un token est requis"));
  } catch (error) {
    res.status(401).send(erreur("checkJwt", "Erreur de jeton"));
  }
};
