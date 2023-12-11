const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//send OTP
exports.sendOTP = async (req,res) => {

    try{
        const {email} = req.body;
        //check if user already exists
        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success : false,
                message: "User already Registered"
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("Generated OTP : ", otp);

        let result = await OTP.findOne({otp:otp});
        
        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp})
        }

        const otpPayload = {email,otp};
        
        //create entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp
        })

    }catch(err){
        console.log(err);
        return res.status(300).json({
            success:false,
            message:err.message
        })
    }

}

//signup
exports.signUp = async (req,res) =>{
    try{
       //data fetch from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        //validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message: "All fields are required"
            })
        }

        //match password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message: "Password does not match"
            });
        }

        //check user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: "User already exists"
            });
        }
        
        //find most recent otp for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length === 0 ){
            return res.status(400).json({
                success:false,
                message: "OTP not found"
            });
        }else if (otp !== recentOtp.otp){
            return res.status(400).json({
                success:false,
                message: "Invalid Otp"
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth : null,
            about : null,
            contactNumber : null
        });

        //create entry in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image : `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        }) 

        return res.status(200).json({
            success:true,
            message:"User is registered succesfully",
            user,
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered"
        })
    }
}

//Login
exports.login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additional details : ");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered"
            }); 
        }
        //generate jwt after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires : new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token,options).status(200).json({
                success:true,
                token,
                user,
                message: "Logged in successfully"
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Passowrd incorrect"
            });
        }
        
        
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Login failed"
        });
    }
}

//changepassword
exports.changePassword = async (req,res) =>{
    //get data from body
    //get oldpass, newpass, confirmpass
    //validation
    //update pass in db
    //send mail - pass updated
    //return res
}