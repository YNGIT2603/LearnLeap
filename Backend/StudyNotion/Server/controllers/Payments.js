const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress")

//initiate the razorpay order
exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({success:false, message:"Please provide Course Id"});
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{
           
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            const uid  = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}



// //capture payment and initate razorpay order
// exports.capturePayment = async (req,res) => {
//     //get courseId and userID
//     const {courseId} = req.body;
//     const userId = req.user.id;
//     //validation //valid course ID
//     if(!courseId){
//         return res.json({
//             success:false,
//             message:"Please provide course ID"
//         })
//     };
    
//     //validate course detail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:"Could not find the course"
//             })
//         }
//         //user already paid for same course?
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:"Student already enrolled"
//             })
//         }

//     }catch(err){
//         console.log(err)
//         return res.status(500).json({
//             success:false,
//             message:err.message
//         })
//     }
    
//     //order create
//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//         amount : amount*100,
//         currency,
//         receipt : Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     }

//     try{
//         //initate payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return repsonse
//         return res.status(200).json({
//             success:true,
//             courseName :course.courseName,
//             thumbnail: course.thumbnail,
//             courseDescription : course.courseDescription,
//             orderID : paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//             message:"Payment successfull"
//         })
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             success:false,
//             message:"Could not initate order"
//         })
//     }
// }

// //verify signature of razorPay and server
// exports.verifySignature = async(req,res) =>{
//     const webhookSecret = '12345678';

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex")

//     if(signature === digest){
//         console.log("Payment is authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;
//         try{
//             //fulful the action
//             //find the course and enroll the student
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id:courseId},
//                 {
//                     $push:{studentEnrolled:userId}
//                 },
//                 {new:true},
//             );

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"course not foudn"
//                 })
//             }

//             console.log(enrolledCourse);

//             //find student and enroll in course
//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id:userId},
//                 {
//                     $push:{courses:courseId}
//                 },
//                 {new:true},
//             )
//             console.log(enrolledStudent);

//             //mail send
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Greetings from LearnLeap || Enrolled",
//                 "You are onboarded into new LearnLeap Course", 
//             );

//             console.log(emailResponse);

//             return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and course added"
//             })


//         }catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success:false,
//                 message:err.message
//             })
//         }
//     }else{
//         return res.status(400).json({
//             success:false,
//             message:err.message
//         })
//     }

// }

// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const {amount,paymentId,orderId} = req.body;
//     const userId = req.user.id;
//     if(!amount || !paymentId) {
//         return res.status(400).json({
//             success:false,
//             message:'Please provide valid payment details',
//         });
//     }
//     try{
//         const enrolledStudent =  await User.findById(userId);
//         await mailSender(
//             enrolledStudent.email,
//             `Study Notion Payment successful`,
//             paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName),
//         );
// }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
// }
