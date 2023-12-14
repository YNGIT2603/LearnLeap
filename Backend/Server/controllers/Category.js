const Category = require("../models/Category");

//create tag handler function

exports.createCategory = async (req,res) => {
    try{
            const {name,description} = req.body;
            if(!name || !description){
                return res.status(400).json({
                    success:false,
                    messaage:"All fields are required"
                });
            }

            const categoryDetails = await Category.create({
                name:name,
                description:description
            });
            console.log(tagDetails);

            return res.status(200).json({
                success:true,
                messaage:"category created successfully",
            })

    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}


//get all tags function
exports.showAllCategory = async (req,res) => {
    try{
            const allCategory = await Category.findOne({}, {name:true, description:true});
            return res.status(200).json({
                success:true,
                messaage:"All categories returned successfully",
            })

    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}

//category page details
exports.categoryPageDetails = async (req,res) =>{
    try{
        //get courseId
        const {categoryId} = req.body;
        //get courses for specified category Id
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                messaage:"data not found"
            });
        }
        //get coruses for differnet category
        const differentCategories = await Category.find(
            {_id: {$ne: categoryId}},
        ).populate("courses")
        .exec();
        //get top selling courses
        //hw


        //return respponse
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories
            },
            messaage:"Successfully fethced"
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            messaage:err.messaage
        });
    }
}