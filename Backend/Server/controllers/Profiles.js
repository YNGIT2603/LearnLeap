const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req,res) => {
    try{
        //get data
        const {dateOfBirth = "", about="", contactNumber,gender} = req.body;
        //get userid
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //find and update profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.age = age;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        //return response
        return res.status(500).json({
            success:true,
            message:"Profile created sccesfully",
            profileDetails
        });


    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to create Profile",
            error:err.message
        });
    }
}

//delete account
exports.deleteAccount = async (req,res) => {
    try{
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }

        //delete profile
        await Profile.findById({_id:userDetails.additionalDetails});
        //delete user
        await User.findById({_id:id});

        //return response
        return res.status(500).json({
            success:true,
            message:"Profile created sccesfully",
            profileDetails
        });


    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to delete account",
            error:err.message
        });
    }
} 

exports.getAllUserDetails = async(req,res) =>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(500).json({
            success:true,
            message:"user details fetched succesfully"
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to fetch user details",
            error:err.message
        });
    }
}