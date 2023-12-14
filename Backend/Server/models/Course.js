const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName : {
        type:String,
    },
    courseDescription : {
        type:String,
    },
    instructor : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn : {
        type:String,
    },
    courseContent  : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews  : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price : {
        type:Number,
    },
    thumbnail : {
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Category"
    },
    //category me ref tag change krna hai
    tag:{
        type:[String], 
        required:true
    },
    studentEnrolled  : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        }
    ],
});


module.exports = mongoose.model("Course",courseSchema);