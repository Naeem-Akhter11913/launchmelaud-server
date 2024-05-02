const mongoose = require("mongoose");

// const db_url = "mongodb+srv://indranilintolap:abcd1234@cluster0.7sfouln.mongodb.net/?retryWrites=true&w=majority"
const db_url = "mongodb+srv://naeemintolap12:naeemintolap12@cluster0.zpe6ylm.mongodb.net/intolapProject?retryWrites=true&w=majority"


mongoose.connect(db_url,{}).then(()=>{console.log("Succesfully connected with Database");}).catch((error)=>{
    console.log("WARNING!!!! Unable to connect with Database.Error is --> "+ error)
})