const express= require("express");
const app= express();
const authRouter= require("./router/authRoute");
const databaseconnect = require("./config/databaseConfig");
const cookieParser= require("cookie-parser");
const cors= require("cors");

databaseconnect();

app.use(express.json()); // to parse the req data
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

// the requests preceded by /api/auth will go to the authRouter
app.use("/api/auth", authRouter)

app.use("/", function(req, res){
    res.status(200).json({data: "JWTauth server"});
})

module.exports= app;