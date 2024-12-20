const express = require('express');
const router = express.Router();
const Achievements = require('../models/AchievementModel');
const multer = require('multer');

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

router.get('/',async(req,res)=>{
    try{
        const achievements = await Achievements.find({})
        if(!achievements)
        {
            return res.status(401).json("no achievements available")
        }
        else
        {
            return res.status(201).json(achievements)
        }
    }catch(err)
    {
        return res.status(500).json({error:err})
    }
})

// Post route to handle file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {

    // Extracting the form fields and file data
    const { topic, description } = req.body;
    const file = req.file ? req.file.filename : null;  // Multer puts the file info in req.file

    // Ensure the required fields are present
    if (!topic || !description || !file) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create new achievement entry in the database
    const achievement = await Achievements.create({
      file: file,
      topic: topic,
      description: description,
    });

    if (!achievement) {
      return res.status(400).json({ message: 'Achievement not created', error: achievement });
    }

    return res.status(201).json({ message: 'Achievement created successfully' });
  } catch (err) {
    // Handle errors
    return res.status(500).json({ error: 'An error occurred during the upload process', details: err });
  }
});

//Update achievement
router.put('/:id', upload.single('file'), async (req, res) => {
    const id = req.params.id; // Access the id correctly from req.params
    try {
      // Log the received data
  
      // Prepare the updated fields (file might be null if no file is uploaded)
      const updateData = {
        topic: req.body.topic,
        description: req.body.description,
        file: req.file ? req.file.filename : undefined, // Update file only if it's provided
      };
  
      // Find and update the achievement by ID
      const achievement = await Achievements.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!achievement) {
        return res.status(400).json({ message: 'Achievement not updated', error: 'Achievement not found' });
      }
  
      // Return success message
      return res.status(200).json({ message: 'Achievement updated successfully', achievement });
    } catch (err) {
      // Return error message if something goes wrong
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  });

  //Delete Achievement
  router.delete('/:id',async(req,res)=>{
    const id = req.params.id
    try{
        const achievement = await Achievements.findByIdAndDelete(id)
        if (!achievement) {
            return res.status(400).json({ message: 'Achievement not Deleted', error: 'Achievement not Deleted' });
          }
      
          // Return success message
          return res.status(200).json({ message: 'Achievement Deleted successfully', achievement });
    }catch (err) {
        // Return error message if something goes wrong
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
  })
  

module.exports = router;
