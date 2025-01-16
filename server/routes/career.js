const express = require('express')
const router = express.Router()
const multer = require('multer')
const Career = require('../models/CareerModel')

// Multer configuration
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

// File filter (optional)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Unsupported file type"), false); // Reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
}) // The field name must match your form input name

// Endpoint to handle form submission
router.post('/',upload.single('resume'), async(req, res) => {
    try{
          const { name, email, phone, address, position, experience, coverLetter } =req.body;
        const careerObj = await Career.create({name:name,email:email,phone:phone,address:address,experience:experience,position:position,coverletter:coverLetter,resume:req.file.filename})
        if(!careerObj)
        {
            return res.status(400).json("Application not sumbitted")
        }
        return res.status(200).send({ message: "Application submitted successfully!" });
      }
      catch(err)
      {
        return res.status(500).json({err:err})
      }

    }

)

router.get('/',async(req,res)=>{
  try{
    const careerObj = await Career.find()
    if(!careerObj)
    {
      return res.status(401).json("Error fetcching response")
    }
    return res.status(201).json(careerObj)
  }
  catch(err)
  {
    return res.json(501).json({error:err})
  }
})

router.delete('/:id',async(req,res)=>{
  try{

    const {id} = req.params
    const careerObj = await Career.findByIdAndDelete(id)
    if(!careerObj)
      {
        return res.status(401).json("Not deleted")
      }
      return res.status(201).json(careerObj)
    }
    catch(err)
    {
      return res.status(501).json({error:err})
    }
})

module.exports = router