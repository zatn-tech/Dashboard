const mongoose = require('mongoose')

const ContcatSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
}
)

const ContactModel = mongoose.model('contact',ContcatSchema)

module.exports=ContactModel