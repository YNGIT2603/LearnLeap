const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req,res) =>{
    try{
        //fetch data
        const {sectionName, courseID} = req.body;
        //data validation
        if(!sectionName || !courseID){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course
        const updatedCourseDetails = await Course.findByIdAndUpdate( 
            courseID,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        ); //hw use populte to replace sections/subsections both in updatedcourseDetails

        //return response
        return res.status(200).json({
            success:true,
            message:"Section created succesfully",
            updatedCourseDetails
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to create section",
            error:err.message
        });
    }
}

exports.updateSection = async (req,res) =>{
    try{
        //data input
        const {sectionName, sectionID} = req.body;
        //data validation
        if(!sectionName || !sectionID){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            });
        }

        //update data
        const updatedCourseDetails = await Section.findByIdAndUpdate( 
            sectionID,
            {sectionName},
            {new:true},
        ); 

        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated succesfully",
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to update section",
            error:err.message
        });
    }
}


exports.deleteSection = async (req,res) =>{
    try{
        //getID - assuming that we are sending ID in params
        const {sectionID} = req.params;

        //findby id and delete
        await Section.findByIdAndDelete(sectionID);

        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted succesfully",
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to delete section",
            error:err.message
        });
    }
}