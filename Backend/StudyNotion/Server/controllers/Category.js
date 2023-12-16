const Category = require('../models/Category');

//create tag handler function

exports.createCategory = async (req,res) => {
    try{
            console.log("Category creation started .. ")
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
            console.log(categoryDetails);

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
            const allCategory = await Category.find({}, {name:true, description:true});
            return res.status(200).json({
                success:true,
                messaage:"All categories returned successfully",
                data: allCategory
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

//add course to category
exports.addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	// console.log("category id", categoryId);
	try {
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if(category.courses.includes(courseId)){
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.courses.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}