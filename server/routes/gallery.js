const express = require('express')
const router = express.Router()
const multer = require('multer')
const Gallery = require('../models/GalleryModel')

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './files');  // Define where the file will be stored
    },
    filename: function (req, file, cb) {
      // You can make the filename unique by using the original file name or using req.body.topic
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);  // Create the filename based on current timestamp and original name
    },
  });
  
  const upload = multer({ storage: storage });

//Get Gallery
router.get('/',async(req,res)=>{
    try{
        const gallery = await Gallery.find({})
        if(!gallery)
        {
            return res.status(400).json("No images/videos found")
        }
        return res.status(201).json(gallery)
    }
    catch(err)
    {
        return res.status(500).json({error:err})
    }
})

//Add new Gallery Content
router.post('/',upload.single('file'),async(req,res)=>{
    const {type,description} = req.body
    const file = req.file ? req.file.filename : req.body.file; 
    console.log(req.body)

    try{
        const galleryObj = await Gallery.create({
            type:type,
            description:description,
            file:file,
        })
        if(!galleryObj)
        {
            return res.status(400).json("Photo / video cannot be uploaded")
        }
        return res.status(200).json("Photo / video uploaded successfully")
    }
    catch(err)
    {
        return res.status(500).json({error:err})
    }
})

router.delete('/:id',async(req,res)=>{
    const id =req.params.id
    console.log(id)
    try{
        const galleryObj =await Gallery.findByIdAndDelete(id)
        if(!galleryObj)
        {
            return res.status(400).json("Gallery item not found")
        }
        return res.status(200).json({msg:"Gallery item deleted",details:galleryObj})
    }
    catch(err)
    {
        return res.status(500).json({error:err})
    }
})

module.exports = router