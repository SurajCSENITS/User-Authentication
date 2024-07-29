const mongoose= require("mongoose");
const JWT= require("jsonwebtoken");
const bcrypt= require("bcrypt");

const userSchema= new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "user name is required"],
            minLength: [5, "name must be atleast 5 char"],
            maxLengthL: [50, "name must be less than 50 char"]
        },
        email: {
            type: String,
            required: [true, "email is required"],
            lowercase: true,
            unique: [true, "already registered"]
        },
        password: {
            type: String,
            required:[ true, "password is mandatory"],
            select: false
        },
    },   {timeseries: true}
)

userSchema.pre("save", async function(next){ // jab bhi ek User ka document save hoga tab tab ye `pre` middleware call hoga
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods= {
    jwtToken(){
        return JWT.sign(
            {id: this._id, email: this.email}, // data
            process.env.SECRET, // secret token
            {expiresIn: "24h"} // token expires in
        )
    }
}

const User= mongoose.model("User", userSchema);
module.exports= User;