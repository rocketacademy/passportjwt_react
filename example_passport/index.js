const express = require("express");
const cors = require("cors");
const passport = require("passport");

const db = require("./db/models/index");
const { user } = db;

const app = express();

require("dotenv").config();
require("./Auth/passport.js")(passport, user);

const API_PORT = process.env.API_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

const AuthRouter = require("./Routers/authRouter.js");
const AuthController = require("./Controllers/authController.js");

const authController = new AuthController(user, passport);
const authRouter = new AuthRouter(express, authController);

app.use("/auth", authRouter.routes());

app.listen(API_PORT, () => {
  console.log(`Listening to ${API_PORT}`);
});
