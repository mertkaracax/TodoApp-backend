const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        username: username,
        password: hashedPw,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username }).then((user) => {
    if (!user) {
      //Yoruma aldığım kod parçacıklarını kullanınca uygulama patlıyor.

      // console.log("KUllanıcı bulunamadııııııııııııı");
      // const error = new Error("username couldn't be found...");
      // error.statusCode = 404;
      // throw error;
      return res.status(401).send({ message: "Username could not be found." });
    }
    loadedUser = user;
    return bcrypt
      .compare(password.toString(), user.password)
      .then((isEqual) => {
        if (!isEqual) {
          const error = new Error("Password is wrong...");
          error.statusCode = 404;
          throw error;
        }
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
          },
          "supersecret",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          username: loadedUser.username,
          userId: loadedUser._id.toString(),
          message: `User named <${loadedUser.username}> logged successfully.`,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          console.log("Buraya girdi");
          err.statusCode = 500;
        }
        next(err);
      });
  });
};
