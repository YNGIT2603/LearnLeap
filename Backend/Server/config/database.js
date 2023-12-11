const mongoose = require('mongoose');

//npm i dotenv
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=> console.log("connection succesfull at database"))
    .catch((error)=>{console.log("issue in establising connection")
    console.log(error.message);
    process.exit(1);    
    });
}
