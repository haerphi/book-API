const jwt = require("jsonwebtoken");
import bd from "../bd/postgresql";

const secret_key = process.env.SECRET_KEY;

export const register = async (req, res) => {
    if (req.body) {
        const {email, password, name} = req.body;
        if (email && password && name) {
            //verify if email already exists
            const rep = await bd.from("users").where("email", email);
            const rep2 = await bd.from("users").where("name", name);
            if (rep.length < 1 && rep2.length < 1) {
                await bd("users").insert({
                    email,
                    password,
                    name,
                });
                res.send({
                    sucess: true,
                    message: `${email} added to the database`,
                });
            } else {
                res.send({
                    sucess: false,
                    error: "This email/name already exists in the database",
                });
            }
        } else {
            res.send({
                sucess: false,
                error: "You need to send an email and a password",
            });
        }
    }
};

//génération du token
export const authentification = async (req, res) => {
    if (req.body) {
        const {email, password} = req.body;
        if (email && password) {
            //verify if email and password matche
            const rep = await bd
                .from("users")
                .where("email", email)
                .where("password", password);
            if (rep.length > 0) {
                //if it matches
                const token = jwt.sign({id: rep[0].id}, secret_key, {
                    expiresIn: "24h",
                });
                const userInfo = {sucess: true, token};
                if (rep[0].role === "admin") {
                    userInfo.admin = true;
                }
                res.send(userInfo);
            } else {
                res.send({
                    sucess: false,
                    error: "Email and password doesn't match",
                });
            }
            //ajouter dans la BD le token
            //TODO
        } else {
            res.send({
                sucess: false,
                error: "You need to send an email and a password",
            });
        }
    } else {
        res.send({sucess: false, error: "No token for you"});
    }
    return null;
};

//est-ce qu'il est authentifier/token valide ?
export const authenticated = async token => {
    //verify token here
    try {
        const go = token.split(" ")[1];

        const decoded = jwt.verify(go, secret_key);
        const rep = await bd.from("users").where("id", decoded.id);
        if (rep.length > 0) {
            return rep[0];
        }
        return {
            sucess: false,
            error: "incorrect informations in the token",
        };
    } catch (err) {
        return {sucess: false, error: err.message};
    }
};
