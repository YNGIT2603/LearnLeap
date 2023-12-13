const Tag = require('../models/tags');

//create tag handler function

exports.createTag = async (req,res) => {
    try{
            const {name,description} = req.body;
            if(!name || !description){
                return res.status(400).json({
                    success:false,
                    messaage:"All fields are required"
                });
            }

            const tagDetails = await Tag.create({
                name:name,
                description:description
            });
            console.log(tagDetails);

            return res.status(200).json({
                success:true,
                messaage:"Tag created successfully",
            })

    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}


//get all tags function
exports.showAllTags = async (req,res) => {
    try{
            const allTags = await Tag.findOne({}, {name:true, description:true});
            return res.status(200).json({
                success:true,
                messaage:"All tags returned successfully",
            })

    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}