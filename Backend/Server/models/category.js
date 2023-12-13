const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    course : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    description : {
        type:Number,
    },
});


module.exports = mongoose.model("Tag",categorySchema);   