const jwt = require("jsonwebtoken");
const jwtConfig = require("../Auth/jwtConfig");

const authenticateJWT = (req, res, next) => {
  console.log("testing auth");

  const tokenCookie = req.cookies["jwt_token"];
  console.log(tokenCookie);

  if (tokenCookie) {
    jwt.verify(tokenCookie, jwtConfig.secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      console.log(user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

class AuthRouter {
  constructor(express, controller) {
    this.express = express;
    this.controller = controller;
  }

  routes() {
    const router = this.express.Router();

    // altered get to remove the username parameter, not needed.
    router.get("/", authenticateJWT, this.controller.getOne);
    router.post("/signup", this.controller.signup);
    router.post("/login", this.controller.login);
    return router;
  }
}

module.exports = AuthRouter;
