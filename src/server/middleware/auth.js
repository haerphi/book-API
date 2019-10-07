const jwt = require("jsonwebtoken");

const secret_key = "banana";

export const register = async (req, res, nect) => {
  res.send("Did you try to register ?");
};

//génération du token
export const authentification = async (req, res, next) => {
  if (req.body) {
    const { email, password } = req.body;
    if (email && password) {
      //verify if email and password matche
      //if (TODO)
      var token = jwt.sign({ email: email }, secret_key);
      res.send({ sucess: true, token: token });
      //ajouter dans la BD le token
      //TODO
    } else {
      res.send({
        sucess: false,
        token: "You need to send an email and a password"
      });
    }
  } else {
    res.send({ sucess: false, token: "No token for you" });
  }
  return null;
};

//est-ce qu'il est authentifier ?
export const authenticated = async (req, res, next) => {
  //verify token here
  if (req.headers.authorization) {
    await next();
  }
  res.send("token unvalidable");
  return false;
};
