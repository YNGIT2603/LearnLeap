

//check if demo user

// WILL REMOVE WHOLE CODE
exports.isDemo = async (req, res, next)=> {
    console.log(req.user.email);
    if (req.user.email === "abc@gmail.com" || req.user.email === "1234@gmail.com") {
        return res.status(401).json({
            success: false,
            message: "This is a Demo User",
        });
    }
    next();
}