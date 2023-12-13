const Tag = require('../models/tags');
const Course = require('../models/Course');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

//create course handler fucntion
exports.createCourse = async (req,res) =>{
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price,tag} = req.body;
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                messaage:"All fields are required"
            }); 
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("INTRUCTOR DETAILS : ", instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                messaage:"Instrutor not found"
            });
        }

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                messaage:"Tag details not found"
            });
        }

        //upload to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME );

        //create entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add the new course to user schema of isntructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        //update tag schema
        //HW


        return res.status(200).json({
            success:true,
            messaage:"Course created Successfully",
            data:newCourse,
        });

        


    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}


//getAllCouses
exports.showAllCourse = async (req,res) => {
    try{
        const allCourse = await Course.find({}).populate("instructor").exec();

        // {courseName:true,
        //     price:true,
        //     thumbnail:true,
        //     instructor:true,
        //     ratingAndReviews:true,
        //     studentEnrolled:true,}
        
        return res.status(200).json({
            success:true,
            messaage:"All courses fetched succesfully",
            data:allCourse,
        });



    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:"Cannot fetch courses",
            error:err.messaage
        });
    }
}