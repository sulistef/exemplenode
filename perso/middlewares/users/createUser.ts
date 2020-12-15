import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../../models/User';
import { TErreur, erreur } from '../../utils/erreurs';
import { success } from '../../utils/success';
import { encodeToken } from '../../utils/jwt';
import { generateHash } from '../../utils/crypt';
import _ from 'lodash';


export const createUser = (req: Request, res: Response, next: NextFunction) => {
	
	const {
		firstName,
		lastName,
		userName,
		email,
		password
	} = req.body;
	
	if (!doitEtreDefini(email)) {
		res.status(401).send(erreur("createUser", 'Une adresse email est nécessaire'));
	} else if (validateEmail(email)) {
		res.status(401).send(erreur("createUser", "L'adresse email n'est pas valide"));	
	} else if (!doitEtreDefini(password)) {
		res.status(401).send(erreur("createUser", 'Le mot de passe ne peut pas être vide'));
	} else {
		
		const user = new User({
			firstName: firstName,
			lastName: lastName,
			userName: userName,
			email: req.body.email,
			password: generateHash(req.body.password),
			isadmin: false
		});
		
		user.save(
			(err: TErreur, user: IUser) => 
				err ? 
					res.status(401).send(erreur("createUser", err)) : 
					res.status(200).send(success(encodeToken(user._id!)))
		);
		
	};
	
};

const doitEtreDefini = (valeur: any): boolean =>
	(_.isNil(valeur) || _.isEmpty(valeur) || _.isUndefined(valeur)) ? false : true;
	
const validateEmail = (email: string): boolean =>
	(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(email) ? false : true;




