const jwt = require("jsonwebtoken");
const jwtSecret = require("../Auth/jwtConfig");

class AuthController {
  constructor(model, passport) {
    this.model = model;
    this.passport = passport;
  }

  getOne = async (req, res, next) => {
    console.log("getting one!");
    console.log(req.cookies);
    this.passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        console.log("authController user:", user);
        console.log(req.params);
        console.log("info", info);

        if (err) {
          console.log(err);
        }
        if (info === {}) {
          console.log("info error");
          res.status(401).send(info.message);
          // updated this strategy to validate using ID not username. (Also removed the username params)
        } else if (user.id === info.id) {
          let userInfo = await this.model.findOne({
            where: {
              username: user.username,
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
          console.error("jwt id do not match");
          res.status(403).send("jwt token do not match");
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
        res.send(err);
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
    console.log(req.cookies);

    this.passport.authenticate("local-login", async (err, user) => {
      if (err) {
        console.error(err);
      }
      const userInfo = await this.model.findOne({
        where: {
          username: user.username,
        },
      });

      // alter below to change how long JWT or cookie lasts.
      // if the time limit runs out the user wont be able to click the button anymore
      const token = jwt.sign({ id: userInfo.id }, jwtSecret.secret, {
        expiresIn: "5s",
      });
      console.log(token);
      console.log(res.cookie("jwt_token", token));

      res.cookie("jwt_token", token, {
        maxAge: 1000 * 10, // 10 second, * 60 * 15, // 15 minute expiry
        httpOnly: false,
        signed: false,
        Path: "/",
      });

      res.send({ auth: true, token, message: "User found and logged in" });
    })(req, res, next);
  };
}

module.exports = AuthController;
