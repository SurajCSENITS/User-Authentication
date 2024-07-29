const User = require("../model/userSchema");
const emailValidator= require("email-validator");
const bcrypt= require("bcrypt");

const signup= async (req, res, next) => {
    const { name, email, password, confirmPassword  }= req.body;
    console.log(name, email, password, confirmPassword);

    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Every field is requied"
        })
    }

    const isValidEmail= emailValidator.validate(email);
    if(!isValidEmail){
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email!"
        })
    }

    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Password & Confirm-Password doesn't match"
        })
    }
    
    try{
        // Store the userinfo into the database
        const userInfo= User({ // creating instance of user-model
            name: name,
            email: email,
            password: password,
        })

        const result= await userInfo.save();
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch(error){ // if data does not get save
        if(error.code === 11000){
            return res.status(400).json({
                success: false,
                message: "Account already exists with provided email id"
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
} 

const signin = async (req, res) => {
    const { email, password }= req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Every field is mandatory!"
        })
    }

    try{
        const loged_user= await User
            .findOne({
                email: email
            })
            .select("+password"); // gives the password of the matched user-schema
        
        if(!loged_user || ! (await bcrypt.compare(password, loged_user.password))){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token= loged_user.jwtToken();
        loged_user.password= undefined; // set password as `null`

        // `token` is inserted into cookie
        const cookieOption= {
            maxAge: 24*60*60*1000,
            httpOnly: true // can not access the cookie from JS side
        }
        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: loged_user
        })
    } catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getUser = async (req, res) => {
    const userId= req.user.id;
    try{
        const user= await User.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const logout = (req, res) => {
    try{
        cookieOption= {
            expires: new Date(),
            httpOnly: true
        };
        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports= {
    signup,
    signin,
    getUser,
    logout
}