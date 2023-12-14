const Course = require('../models/Course');
const User = require('../models/User');
const Course = require('../models/RatingAndReview');
const RatingAndReview = require('../models/RatingAndReview');
const { default: mongoose } = require('mongoose');

//create Rating
exports.createRating = async (req,res) =>{
    try{
        //get user id
        const userId = req.user.id;
        //fetch data from body
        const {rating,review,courseId} = req.body;
        //check user enrolled or not
        const cousreDetails = await Course.findOne(
            {_id:courseId,
            studentEnrolled: {$elemMatch: {$eq: userId}},
            }
        );
        if(!cousreDetails){
            return res.status(404).json({
                success:false,
                messaage:"Student not enrolled in the course"
            }); 
        }
        //check if already reviewed by same user
        const alreadyReviewed = await RatingAndReview.findOne(
            {
                user:userId,
                course:courseId,
            }
        );

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                messaage:"Course already reviewed by user"
            });
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course:courseId, //ERror POSSIBILITY *************************************
            user:userId
        });

        //update course with rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push :{
                    ratingAndReviews:ratingReview._id
                }
            },
            {new:true}
        ); 
        console.log(updatedCourseDetails);  

        //return response
        return res.status(200).json({
            success:true,
            messaage:"Ratind and review created succesfully",
            ratingReview
        });


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            messaage:err.messaage,
        });
    }
}


//get avg rating
exports.getAverageRating = async (req,res) =>{
    try{
        //get courseID
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating : {$avg: "rating"},
                }
            }
        ])

        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        }

        // if no rating review exist
        return res.status(200).json({
            success:true,
            averageRating:0,
            messaage:"Course has not been rated"
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}

//get all ratings
exports.getAllRating = async (req,res) =>{
    try{
        const allReviews = await RatingAndReview.find({})
            .sort({rating:"desc"})
            .populate({
                path:'user',
                select:"firstName lastName email image",
            })
            .populate({
                path:"course",
                select:"courseName",
            })
            .exec();
        
        return res.status(200).json({
            success:true,
            messaage:"All reviews fetched",
            data:allReviews
        });
        
    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}