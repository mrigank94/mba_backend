const User = require("../models/user.model");
var bcrypt = require("bcryptjs");

exports.update = async (req, res) => {
  const userIdReq = req.userId;
  try {
    const user = await User.findOneAndUpdate(
      {
        userId: userIdReq,
      },
      {
        password: bcrypt.hashSync(req.body.password, 8),
      }
    ).exec();
    res.status(200).send({
      message: `User record has been updated successfully`,
    });
  } catch (err) {
    console.error("Error while updating the record", err.message);
    res.status(500).send({
      message: "Some internal error occured",
    });
  }
};

/**
 * Update the user status
 */

exports.updateUser = async (req, res) => {
  const userIdReq = req.params.userId;
  try {
    const user = await User.findOneAndUpdate(
      {
        userId: userIdReq,
      },
      {
        name: req.body.name,
        userStatus: req.body.userStatus,
        userType: req.body.userType,
      }
    ).exec();
    res.status(200).send({
      message: `User record has been updated successfully`,
    });
  } catch (err) {
    console.err("Error while updating the record", err.message);
    res.status(500).send({
      message: "Some internal error occured",
    });
  }
};

exports.findAll = async (req, res) => {
  //Supporting the query param
  let userTypeReq = req.query.userType;
  let userStatusReq = req.query.userStatus;
  let userNameReq = req.query.name;

  var users;
  if (userNameReq) {
    try {
      users = await User.find({
        userName: userNameReq,
      });
    } catch (err) {
      console.log("error while fetching the user for userName : ", userNameReq);
      res.status(500).send({
        message: "Some internal error occured",
      });
      return;
    }
  } else if (userTypeReq && userStatusReq) {
    try {
      users = await User.find({
        userType: userTypeReq,
        userStatus: userStatusReq,
      });
    } catch (err) {
      console.log(
        `error while fetching the user for userType [${userTypeReq}] and userStatus [${userStatusReq}]`
      );
      res.status(500).send({
        message: "Some internal error occured",
      });
      return;
    }
  } else if (userTypeReq) {
    try {
      users = await User.find({
        userType: userTypeReq,
      });
    } catch (err) {
      console.log(
        `error while fetching the user for userType [${userTypeReq}] `
      );
      res.status(500).send({
        message: "Some internal error occured",
      });
      return;
    }
  } else if (userStatusReq) {
    try {
      users = await User.find({
        userStatus: userStatusReq,
      });
    } catch (err) {
      console.log(
        `error while fetching the user for userStatus [${userStatusReq}] `
      );
      res.status(500).send({
        message: "Some internal error occured",
      });
      return;
    }
  } else {
    try {
      users = await User.find();
    } catch (err) {
      console.log(`error while fetching the users `);
      res.status(500).send({
        message: "Some internal error occured",
      });
      return;
    }
  }
  res.status(200).send(users);
};
