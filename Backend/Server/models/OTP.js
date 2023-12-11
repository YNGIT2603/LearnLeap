const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true
    },
    otp : {
        type:String,
        required:true
    },
    createdAt : {
        type:Date,
        default:Date.now(),
        expires:5*60
    },
});


//fucntiuon to send mail

async function sendVerificationEMail (email,otp) {
    try{
        const mailResponse = await mailSender(email,"Verification Mail", otp);
        console.log("Email sent successfully ",mailResponse);
    }catch(err){
        console.log("Error occurerd while sending mail:" , err);
        throw err;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEMail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);   