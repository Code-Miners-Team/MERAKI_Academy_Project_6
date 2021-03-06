const userModel = require("../database/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let checkEmail = [];
const login = (req, res) => {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .then((resultUser) => {
      bcrypt.compare(password, resultUser.password, (err, result) => {
        if (result) {
          //generate Token
          const payload = {
            userId: resultUser._id,
            name: resultUser.name,
            role: resultUser.role,
          };

          const option = {
            expiresIn: "24h",
          };

          const token = jwt.sign(payload, process.env.SECRET, option);
          checkEmail.push(result.email);

          res.status(200).json({
            success: true,
            massage: " Valid login credentials",
            token,
            userId: resultUser._id,
            role: resultUser.role,
            name:resultUser.name,
            email:resultUser.email
          });
        } else {
          res.status(403).json({
            success: false,
            message: "The password you’ve entered is incorrect",
          });
        }
      });
      checkEmail = [];
    })
    .catch((err) => {
      if (checkEmail.length == 0) {
        res.status(404).json({
          success: false,
          massage: "The email doesn't exist",
        });
      } else {
        res.json(err);
      }
    });
};

module.exports = {
  login,
};
