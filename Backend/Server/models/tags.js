const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
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


module.exports = mongoose.model("Tag",tagsSchema);   