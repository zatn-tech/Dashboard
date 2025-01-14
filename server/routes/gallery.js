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

//Bulk upload images
router.post('/bulk', upload.array('files', 10), async (req, res) => {  // 'files' is the name of the input field
    const { description } = req.body;  // Description is the image number
    console.log(req.body)
  
    // Ensure files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json("No files uploaded");
    }
  
    // Loop through the uploaded files and save them to the database
    try {
      const galleryItems = await Promise.all(req.files.map(async (file, index) => {
        const imageDescription = `${description}-${index + 1}`;  // Description can be like "image-1", "image-2", etc.
        
        const galleryObj = await Gallery.create({
          type: 'image',
          description: imageDescription,  // Using the description as image number
          file: file.filename,  // Save the uploaded file name
        });
  
        return galleryObj;
      }));
  
      return res.status(200).json({ message: "Photos uploaded successfully", galleryItems });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });

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