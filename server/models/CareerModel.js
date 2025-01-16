const mongoose = require('mongoose')

const CareerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    position:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    coverletter:{
        type:String,
        required:true,
    },
    resume:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
}
)

const CareerModel = mongoose.model('career',CareerSchema)

module.exports = CareerModel