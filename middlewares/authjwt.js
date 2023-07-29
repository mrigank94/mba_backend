const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config.js");
const User = require("../models/user.model");
const constants = require("../utils/constants");
const Theatre = require("../models/theatre.model");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findOne({
    userId: req.userId,
  });
  if (user && user.userType == constants.userTypes.admin) {
    next();
  } else {
    res.status(403).send({
      message: "Require Admin Role!",
    });
    return;
  }
};

isAdminOrClient = async (req, res, next) => {
  const user = await User.findOne({
    userId: req.userId,
  });
  if (
    user &&
    (user.userType == constants.userTypes.admin ||
      user.userType == constants.userTypes.client)
  ) {
    next();
  } else {
    return res.status(403).send({
      message: "Require Admin Role or Client role!",
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrClient: isAdminOrClient,
};
module.exports = authJwt;
