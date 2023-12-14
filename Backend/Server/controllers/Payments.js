const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');
const Razorpay = require('razorpay');


//capture payment and initate razorpay order
exports.capturePayment = async (req,res) => {
    //get courseId and userID
    const {courseId} = req.body;
    const userId = req.user.id;
    //validation //valid course ID
    if(!courseId){
        return res.json({
            success:false,
            message:"Please provide course ID"
        })
    };
    
    //validate course detail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find the course"
            })
        }
        //user already paid for same course?
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student already enrolled"
            })
        }

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
    
    //order create
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount : amount*100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    }

    try{
        //initate payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return repsonse
        return res.status(200).json({
            success:true,
            courseName :course.courseName,
            thumbnail: course.thumbnail,
            courseDescription : course.courseDescription,
            orderID : paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
            message:"Payment successfull"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Could not initate order"
        })
    }
}

//verify signature of razorPay and server
exports.verifySignature = async(req,res) =>{
    const webhookSecret = '12345678';

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex")

    if(signature === digest){
        console.log("Payment is authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;
        try{
            //fulful the action
            //find the course and enroll the student
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {
                    $push:{studentEnrolled:userId}
                },
                {new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not foudn"
                })
            }

            console.log(enrolledCourse);

            //find student and enroll in course
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {
                    $push:{courses:courseId}
                },
                {new:true},
            )
            console.log(enrolledStudent);

            //mail send
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Greetings from LearnLeap || Enrolled",
                "You are onboarded into new LearnLeap Course", 
            );

            console.log(emailResponse);

            return res.status(200).json({
                success:true,
                message:"Signature verified and course added"
            })


        }catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }
    }else{
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }

}