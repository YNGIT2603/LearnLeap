const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imageUploader');


exports.createSubSection = async (req,res) =>{
    try{
        //fetch data
        const {sectionId, title,timeDuration, description} = req.body;
        //fetch video
        const video = req.files.videoFile;
        //data validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            });
        }
        //upload to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create  sub section
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update course
        const updatedSection = await Section.findByIdAndUpdate( 
            {_id:sectionId},
            {
                $push:{
                    subSection:subSectionDetails._id,
                }
            },
            {new:true},
        ); 


        //return response
        return res.status(200).json({
            success:true,
            message:"Sub Section created succesfully",
            updatedSection
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to create sub section",
            error:err.message
        });
    }
}
//HW: UPDATE AND DELTE PART 
exports.updateSubSection = async (req,res) =>{
    try{
        //data input
        const {subSectionId, title,timeDuration, description} = req.body;
        //data validation
        if(!subSectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            });
        }

        //update sub Section
        const updatedSubSectionDetails = await SubSection.findByIdAndUpdate( 
            subSectionId,
            {
                title:title,
                timeDuration:timeDuration,
                description:description
            },
            {new:true},
        ); 

        //return response
        return res.status(200).json({
            success:true,
            message:"Sub Section updated succesfully",
            updatedSubSectionDetails
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to update sub section",
            error:err.message
        });
    }
}


exports.deleteSubSection = async (req,res) =>{
    try{
        //getID - assuming that we are sending ID in params
        const {subSectionID} = req.params;

        //findby id and delete
        await subSection.findByIdAndDelete(subSectionID);

        //return response
        return res.status(200).json({
            success:true,
            message:"sub Section deleted succesfully",
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to delete sub section",
            error:err.message
        });
    }
}