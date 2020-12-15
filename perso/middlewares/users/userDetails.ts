import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/User";
import { Either } from 'purify-ts/Either';
import { erreur, TErreur } from "../../utils/erreurs";
import { success } from '../../utils/success';

export const userDetails = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = res.locals.jwtPayload;

  User.getUserByUserId(userId)
    .then((erreurOuUser: Either<TErreur, IUser>) =>
      erreurOuUser.caseOf({
        Left: (err) => res.status(401).send(err),
        Right: user => res.status(200).send(success(User.userDataToReturn(user)))
      })
    )
};
