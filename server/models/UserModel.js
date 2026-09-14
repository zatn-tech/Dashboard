const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        required:false,
        default:null,
    },
    designation:{
        type:String,
        required:true,
    },
},
{
    timestamps:true,
}
)

const UserModel = mongoose.model('user',UserSchema)
module.exports = UserModel