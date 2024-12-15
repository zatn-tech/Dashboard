const mongoose = require('mongoose')

const InterestedSchema = mongoose.Schema({
    count:{
        type:Number,
        required:true,
    }
},{
    timestamps:true,
})

const InterestedModel = mongoose.model('interested',InterestedSchema)
module.exports = InterestedModel