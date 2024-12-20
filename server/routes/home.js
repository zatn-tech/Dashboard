const express = require('express')
const router = express.Router()
const Achievement = require('../models/AchievementModel')
const Gallery = require('../models/GalleryModel')


router.get('/',async(req,res)=>{
    try{
        const achievements = await Achievement.find().limit(6)
        const gallery = await Gallery.find({type:"image"}).limit(10)
        if(!achievements)
        {
            throw new error("Achievements cannot be fetch")
        }
        if(!gallery)
        {
            throw new error("Gallery cannot be fetched")
        }
        return res.status(200).json({achievements,gallery})
    }catch(err)
    {
        return res.status(500).json({error:err})
    }

})


module.exports=router