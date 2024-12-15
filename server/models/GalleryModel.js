const mongoose = require('mongoose')

const GallerySchema = new mongoose.Schema({
    file:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

const GalleryModel = mongoose.model('gallery',GallerySchema)

module.exports = GalleryModel