import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { success } from "../../utils/success";

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { identifiant, motdepasse } = req.body;
  
  User.validateUser(identifiant, motdepasse).then((validation) =>
    validation.caseOf({
      Left: (err) => res.status(401).send(err),
      Right: (token: string) => res.status(200).send(success(token)),
    })
  );
};
