const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcrypt');

//reset password token
exports.resetPasswordToken = async (req,res) =>{
    try{
        //get email from req body
        const email = req.body.email;
        //check user for this email, email validation
        const user = await User.findOne({email:email});   
        if(!user){
            return res.json({
                success:false,
                message:"User not found"
            });
        }

        //generate token
        const token = crypto.randomUUID();
        
        //update user by adding token and expiration time
        const udpatedDetails = await User.findOneAndUpdate({email:email},
                    {
                        token:token,
                        resetPasswordExpires:Date.now() + 5*60*1000, 
                    },
                    {new:true});
        //create url
        const url = `http://localhost:3000/update-password/${token}`;


        //sedn mail containing the url
        await mailSender(email, "Password Reset Link", `Password Reset Link : ${url} `);
        //return response
        return res.json({
            success:true,
            message:"Email sent, check and change password",
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Soemthing went wrong while sending password reset mail",
        })
    }
    
}

//reset password
exports.resetPassword = async (req,res) => {
    try{
            //data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }

        //get user details from DB using token
        const userDetails = await User.findOne({token:token});
        //if no entry=> invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token invalid",
            });
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token Expired",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //update pass
        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},
            {new:true});
        //return res
        return res.status(200).json({
            success:true,
            message:"Password Reset Succesfully",
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"",
        });
    }
}