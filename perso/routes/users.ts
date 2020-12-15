import express, { Request, Response } from "express";
import User, {IUser} from '../models/User';
import { TErreur, erreur } from "../utils/erreurs";
import { Either, Left, Right } from "purify-ts/Either";
import { checkJwt } from "../middlewares/jwt/checkJwt";
import { userDetails } from "../middlewares/users/userDetails";
import { loginUser } from "../middlewares/users/loginUser";
import { createUser } from "../middlewares/users/createUser";

const usersRouter = express();

usersRouter.post("/details", [checkJwt, userDetails]);
usersRouter.post("/login", [loginUser]);
usersRouter.post("/create", [createUser]);
usersRouter.post("/update", []);


export default usersRouter;
