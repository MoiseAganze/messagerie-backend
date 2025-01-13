const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const datas = jwt.verify(token, process.env.secret_jwt || "sanji");
    const user = await User.findOne({
      _id: datas.id,
      "authTokens.authToken": token,
    });
    if (!user) {
      return res.status(401).json({ error: "problème d'authentification" });
    }

    req.userdatas = user;
    return next();
  } catch (error) {
    return res.status(403).json({ error: "token expired" });
  }
};

module.exports = verifyToken;
