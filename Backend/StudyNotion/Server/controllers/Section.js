const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body;

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName });

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE a section
exports.updateSection = async (req, res) => {
  try {
    console.log("Reached inside update section")
    const { sectionName, sectionId, courseId } = req.body;
    console.log("data extracted from body")
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    console.log("find by id and update statement done")
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: section,
      data: course,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE a section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    //delete sub section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};   


//OLD CODE
// exports.createSection = async (req,res) =>{
//     try{
//         //fetch data
//         const {sectionName, courseId} = req.body;
//         //data validation
//         if(!sectionName || !courseId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Missing properties"
//             });
//         }
//         //create section
//         const newSection = await Section.create({sectionName});
//         //update course
//         const updatedCourseDetails = await Course.findByIdAndUpdate( 
//             courseId,
//             {
//                 $push:{
//                     courseContent:newSection._id,
//                 }
//             },
//             {new:true},
//         ); //hw use populte to replace sections/subsections both in updatedcourseDetails

//         //return response
//         return res.status(200).json({
//             success:true,
//             message:"Section created succesfully",
//             updatedCourseDetails
//         });

//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:"unable to create section",
//             error:err.message
//         });
//     }
// }

// exports.updateSection = async (req,res) =>{
//     try{
//         //data input
//         const {sectionName, sectionId} = req.body;
//         //data validation
//         if(!sectionName || !sectionId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Missing properties"
//             });
//         }

//         //update data
//         const updatedCourseDetails = await Section.findByIdAndUpdate( 
//             sectionId,
//             {sectionName},
//             {new:true},
//         ); 

//         //return response
//         return res.status(200).json({
//             success:true,
//             message:"Section updated succesfully",
//             updatedCourseDetails
//         });

//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:"unable to update section",
//             error:err.message
//         });
//     }
// }


// exports.deleteSection = async (req,res) =>{
//     try{
//         //getID - assuming that we are sending ID in params
//         const {sectionId} = req.params;

//         //findby id and delete
//         await Section.findByIdAndDelete(sectionId);

//         //return response
//         return res.status(200).json({
//             success:true,
//             message:"Section deleted succesfully",
//         });

//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:"unable to delete section",
//             error:err.message
//         });
//     }
// }