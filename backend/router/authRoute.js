const express= require("express");
const { signup, signin, getUser, logout } = require("../controller/authController");
const jwtAuth = require("../middleware/jwtAuth");
const authRouter= express.Router();

// `post` is used to create/access an entity
// koi bhi /signup me post request marega tho /signup ka controller execute hoga
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logout);

module.exports= authRouter;