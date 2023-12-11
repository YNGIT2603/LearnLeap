const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({
    review : {
        type:String,
        required:true
    },
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating : {
        type:Number,
    },
});


module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);