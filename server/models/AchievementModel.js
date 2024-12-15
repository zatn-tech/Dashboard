const mongoose = require('mongoose')

const AchievementSchema = new mongoose.Schema({
    file:{
        type:String,
        required:true,
    },
    topic:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
}
)

const AchievementModel = mongoose.model('achievement',AchievementSchema)

module.exports = AchievementModel