const User = require("../model/user.model.js");
const blackListData = require("../model/blackList.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @name UserResgistration
 * @desc Handle user registration logic and email , password validation
 * @access Public
 */

const UserResgistration = async (req, res) => {

    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Username, Email and Password are required"
        })
    }
    const isAlreadyExist = await User.findOne({ $or: [{  username }, { email }] }); 

    if (isAlreadyExist) {
        return res.status(400).json({
            message: "Username or Email already exist"
        })
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password : hasedPassword
    })
    await user.save();
    
    const token = jwt.sign({
        id: user._id,
        username: user.username,
    },process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token,{
    httpOnly: true,
    secure: true,
    sameSite: 'none'
    })
    
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

/**
 * @name Userlogin
 * @desc Handle user login logic and email , password validation
 * @access Public
 */

const Userlogin = async (req, res) => {
 const {email, password} = req.body;

 const user = await User.findOne({email})

 if(!user){
    return res.status(400).json({
        message: "Invalid email or password "
    })
 }
 const isPasswordValid = await bcrypt.compare(password, user.password);

 if(!isPasswordValid){
    return res.status(400).json({
        message: "Invalid  password"
    })
 }

 const token = jwt.sign({
    id: user._id,
    username: user.username,
 }, process.env.JWT_SECRET, { expiresIn: '1d' });


 
 res.cookie('token', token,{
     httpOnly: true,
    secure: true,
    sameSite: 'none'
 });
 res.status(200).json({
    message: "User logged in successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
    }
 });
}
/**
 * @name Userlogout
 * @desc Handle user logout logic and blacklist the token
 * @access Public
 */

const Userlogout = async(req,res) =>{
    const token = req.cookies.token; 
    if(token){
        await blackListData.create({token})
    }

    res.clearCookie('token');
    res.status(200).json({
        message: "User logged out successfully"
    });
}

/**
 * @name GetMe
 * @desc Get current logged in user details
 * @access Private
 */

const GetMe = async (req,res) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        message : " User details Fetched Succesfully",
        user : {
            id:user._id,
            email: user.email,
            username: user.username,
        }
    })
}

module.exports = {
    UserResgistration,
    Userlogin,
    Userlogout,
    GetMe
}