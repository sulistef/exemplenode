import { Document, Model, model, Types, Schema, Query } from "mongoose";
import bcrypt from "bcrypt";
import { encodeToken } from "../utils/jwt";
import { TErreur, erreur } from "../utils/erreurs";
import { Either, Left, Right } from "purify-ts/Either";
import _ from "lodash";

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
  updated_at: {
    type: Date,
    default: () => new Date(),
  },
});

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  isadmin: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type TUser = {
  _id?: string,
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password?: string, 
  isadmin: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type TDonneesInscription = {
  firstName: string, 
  lastName: string, 
  userName: string,
  email: string,
  password: string, 
  isadmin: boolean
};

export interface IUserModel extends Model<IUser> {
  generateHash(password: string): string;
  validPassword(password: string): boolean;
  getUserByUserId(userId: string): Promise<Either<TErreur, IUser>>;
  validateUser(
    email: string,
    motdepasse: string
  ): Promise<Either<TErreur, string>>;
  userDataToReturn(user: IUser): TUser;
  createUser(nouvelUtilisateur: IUser): Either<TErreur, IUser>;
  updateUser(utilisateur: IUser): Either<TErreur, IUser>;
}

UserSchema.methods.generateHash = function (password: string) {
  bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.statics.validPassword = function (password: string, passwd: string) {
  return bcrypt.compareSync(password, passwd);
};

UserSchema.statics.getUserByUserId = function (
  userId: string
): Promise<Either<TErreur, IUser>> {
  return this.findById(userId)
    .then((user: IUser, err: string) =>
      user ? Right(user) : Left(erreur("getUserByUserId", err))
    )
    .catch((error: string) => Left(erreur("getUserByUserId", error)));
};

UserSchema.statics.validateUser = function (
  email: string,
  motdepasse: string
): Promise<Either<TErreur, string>> {
  return this.find({ email: email }).then((user: IUser[], err: TErreur) =>
    err
      ? Left(erreur("loginUser", err))
      : !user
      ? Left(erreur("loginUser", "Mauvais login ou mopt de passe"))
      : _.isEmpty(user)
      ? Left(erreur("loginUser", "Mauvais login ou mopt de passe"))
      : this.validPassword(motdepasse, user[0].password)
      ? Right(encodeToken(user[0]._id))
      : Left(erreur("loginUser", "Mauvais login ou mopt de passe"))
  );
};

UserSchema.statics.userDataToReturn = function (user: IUser): TUser {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    isadmin: user.isadmin,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

UserSchema.statics.createUser = function (nouvelUtilisateur: IUser): Either<TErreur, IUser> {
  return this.save(nouvelUtilisateur, (err: TErreur, user: IUser) => 
    err ? Left(erreur("createUser", err)) : Right(user)
  )
};

UserSchema.statics.updateUser = function (utilisateur: IUser): Either<TErreur, IUser> {
  return this.findOneAndUpdate({_id: utilisateur.id}, utilisateur, (err: TErreur, user: IUser) => 
    err ? Left(erreur("createUser", err)) : Right(user)
  )
};

export default model<IUser, IUserModel>("User", UserSchema);
