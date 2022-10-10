const express = require("express");
const cors = require("cors");
const passport = require("passport");

const cookieParser = require("cookie-parser");

const db = require("./db/models/index");
const { user } = db;

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
require("dotenv").config();
require("./Auth/passport.js")(passport, user);

const API_PORT = process.env.API_PORT || 8080;

const AuthRouter = require("./Routers/authRouter.js");
const AuthController = require("./Controllers/authController.js");

const authController = new AuthController(user, passport);
const authRouter = new AuthRouter(express, authController);

app.use("/auth", authRouter.routes());

app.listen(API_PORT, () => {
  console.log(`Listening to ${API_PORT}`);
});
