const jwt = require("jsonwebtoken");
const jwtConfig = require("../Auth/jwtConfig");

const authenticateJWT = (req, res, next) => {
  console.log("testing auth");
  console.log(req.cookies);
  console.log(req.cookies["jwt_token"]);

  console.log(req.headers);
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwtConfig.secret, (err, user) => {
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

    router.get("/:username", authenticateJWT, this.controller.getOne);
    router.post("/signup", this.controller.signup);
    router.post("/login", this.controller.login);
    return router;
  }
}

module.exports = AuthRouter;
