const bcrypt = require("bcrypt");
const jwtSecret = require("./jwtConfig");

const BCRYPT_SALT_ROUNDS = 12;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

module.exports = (passport, User) => {
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
        session: false,
      },
      async (req, username, password, done) => {
        try {
          let user = await User.findOne({
            where: {
              username,
            },
            where: {
              email: req.body.email,
            },
          });

          if (user != null) {
            console.log("Username or email taken. ");
            return done(null, false, {
              message: "Username or email taken already!",
            });
          }
          let hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
          let newUser = await User.create({
            username,
            password: hashedPassword,
            email: req.body.email,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          let user = await User.findOne({
            where: { username },
          });

          if (user === null) {
            return done(null, false, { message: "Username is incorrect" });
          }

          let passwordTest = await bcrypt.compare(password, user.password);

          if (passwordTest !== true) {
            console.log("Password doesnt work");
            return done(null, false, { message: "Password is not correct" });
          }

          console.log("User Found and authenticated: ", user);
          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) token = req.cookies["jwt_token"];
    return token;
  };

  const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: jwtSecret.secret,
  };

  passport.use(
    "jwt",
    new JWTStrategy(options, async (jwt_payload, done) => {
      try {
        console.log(jwt_payload);
        let user = await User.findOne({
          where: {
            id: jwt_payload.id,
          },
        });

        // pass the JWT token from the request to the authcontroller to validate the ID's match
        if (user) {
          console.log("User found in DB", user);
          done(null, user, jwt_payload);
        } else {
          console.log("User not in db");
          done(null, false);
        }
      } catch (err) {
        done(err);
      }
    })
  );
};
