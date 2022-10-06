const jwt = require("jsonwebtoken");
const jwtSecret = require("../Auth/jwtConfig");

class AuthController {
  constructor(model, passport) {
    this.model = model;
    this.passport = passport;
  }

  getOne = async (req, res, next) => {
    console.log("getting one!");
    this.passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        console.log("authController user:", user);
        console.log("authController info:", info);
        console.log(req.params);

        if (err) {
          console.log(err);
        }
        if (info !== undefined) {
          console.log(info.message);
          res.status(401).send(info.message);
        } else if (user.username === req.params.username) {
          let userInfo = await this.model.findOne({
            where: {
              username: req.params.username,
            },
          });

          if (userInfo != null) {
            console.log("user found in db from findUsers");
            res.status(200).send({
              auth: true,
              email: userInfo.email,
              username: userInfo.username,
              password: userInfo.password,
              message: "user found in db",
              id: userInfo.id,
            });
          } else {
            console.error("no user exists in db with that username");
            res.status(401).send("no user exists in db with that username");
          }
        } else {
          console.error("jwt id and username do not match");
          res.status(403).send("username and jwt token do not match");
        }
      }
    )(req, res, next);
  };

  signup = async (req, res, next) => {
    console.log("signup");
    console.log(req.body);
    this.passport.authenticate("local-signup", async (err, user) => {
      if (err) {
        console.error(err);
      }
      const userInfo = await this.model.findOne({
        where: {
          username: user.username,
        },
      });
      userInfo.update({
        email: req.body.email,
      });
      res.status(200).send({ message: "User Made?" });
    })(req, res, next);
  };

  login = async (req, res, next) => {
    console.log("login");
    console.log(req.body);

    this.passport.authenticate("local-login", async (err, user) => {
      if (err) {
        console.error(err);
      }
      const userInfo = await this.model.findOne({
        where: {
          username: user.username,
        },
      });

      const token = jwt.sign({ id: userInfo.id }, jwtSecret.secret, {
        expiresIn: 60 * 24,
      });
      // send a cookie

      res
        .status(200)
        .send({ auth: true, token, message: "User found and logged in" });
    })(req, res, next);
  };
}

module.exports = AuthController;
