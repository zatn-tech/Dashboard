const express = require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcrypt')
require('dotenv').config()
const PORT = process.env.PORT
const app = express()
const multer = require('multer')
const cookieParser = require('cookie-parser');

//Models
const Achievement = require('./models/AchievementModel')
const Contact = require('./models/ContactModel')
const Gallery = require('./models/GalleryModel')
const Interested = require('./models/InterestedModel')
const User = require('./models/UserModel')

app.use(express.json({limit:'20mb'}))
app.use(express.urlencoded({extended:true,limit:'20mb'}))
app.use('/files', express.static(__dirname+'/files'));
app.use(cors({credentials:true,origin:['http://localhost:3001','http://localhost:3000','https://61q15751-3000.inc1.devtunnels.ms']}))
app.use(cookieParser())

//routes import
const achievementRoute = require('./routes/achievement')
const contactRoute = require('./routes/contact')
const careerRoute = require('./routes/career')
const galleryRoute = require('./routes/gallery')
const interestedtRoute = require('./routes/interested')
const authenticationRoute = require('./routes/authentication')
const homeRoute = require('./routes/home')

// server connection
app.listen(PORT,console.log("SERVER RUNNING ON PORT : "+PORT))

// database connection
mongoose.connect(process.env.MONGoDB_URI,console.log("Database connected"))

// Helper function to get the start of a given week (Sunday to Saturday)
function getStartOfWeek(date) {
    const dayOfWeek = date.getDay();
    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Get difference to Sunday
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - diffToSunday);
    startOfWeek.setHours(0, 0, 0, 0); // Start at midnight
    return startOfWeek;
  }
  
  // Helper function to get the start of the previous week
  function getStartOfPreviousWeek(date) {
    const startOfCurrentWeek = getStartOfWeek(date);
    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7); // Subtract 7 days to get previous week
    return startOfPreviousWeek;
  }

//dashboard details
app.get('/dashboard',async(req,res)=>{
    try
    {
        const today = new Date();
        const startOfThisWeek = getStartOfWeek(today);
        const startOfLastWeek = getStartOfPreviousWeek(today);
        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // End of the current week (Sunday)

           // Query counts for the current week
    const currentWeekContactCount = await Contact.countDocuments({
        createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek }
      });
      const currentWeekGalleryCount = await Gallery.countDocuments({
        createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek }
      });
      const currentWeekAchievementCount = await Achievement.countDocuments({
        createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek }
      });
      const currentWeekInterestCount = await Interested.countDocuments({
        createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek }
      });
      
  
      // Query counts for the previous week
      const previousWeekContactCount = await Contact.countDocuments({
        createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek }
      });
      const previousWeekGalleryCount = await Gallery.countDocuments({
        createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek }
      });
      const previousWeekAchievementCount = await Achievement.countDocuments({
        createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek }
      });
      const previousWeekInterestCount = await Interested.countDocuments({
        createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek }
      });
  
      // Calculate the percentage difference
      function calculatePercentageDifference(currentCount, previousCount) {
        if (previousCount === 0) {
          return currentCount === 0 ? 0 : 100; // Handle the case where the previous count is 0
        }
        return ((currentCount - previousCount) / previousCount) * 100;
      }
  
      const contactDifferencePercentage = calculatePercentageDifference(currentWeekContactCount, previousWeekContactCount);
      const achievementDifferencePercentage = calculatePercentageDifference(currentWeekAchievementCount, previousWeekAchievementCount);
      const galleryDifferencePercentage = calculatePercentageDifference(currentWeekGalleryCount, previousWeekGalleryCount);
      const interestedDifferencePercentage = calculatePercentageDifference(currentWeekInterestCount, previousWeekInterestCount);
      console.log(currentWeekInterestCount,previousWeekInterestCount)
  

        const achievement = await Achievement.countDocuments()
        const gallery = await Gallery.countDocuments()
        const contact = await Contact.countDocuments()
        const interested = await Interested.countDocuments()
        return res.status(200).json({achievement:{count:achievement,diff:achievementDifferencePercentage},gallery:{count:gallery,diff:galleryDifferencePercentage},contact:{count:contact,diff:contactDifferencePercentage},interested:{count:interested,diff:interestedDifferencePercentage}})
    }
    catch(err)
    {
        return res.status(500).json({error:err})
    }
})

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './files');  // Define where the file will be stored
    },
    filename: function (req, file, cb) {
      // You can make the filename unique by using the original file name or using req.body.topic
      const filename = `${req.body.username}-${file.originalname}`;
      cb(null, filename);  // Create the filename based on current timestamp and original name
    },
  });
  
  const upload = multer({ storage: storage });
  
  app.post('/createnewuser', upload.single('file'), async (req, res) => {
      try {
          // Extract data from the request
          const { username, password, designation } = req.body;
          const file = req.file?.filename;
  
          // Check if all required fields are provided
          if (!username || !password || !designation) {
              return res.status(400).json({ message: 'All fields are required' });
          }
  
          // Check if username already exists
          const existingUser = await User.findOne({ username });
          if (existingUser) {
              return res.status(400).json({ message: 'Username already exists' });
          }
  
          // Hash the password using bcrypt (async version)
          const salt = await bcrypt.genSalt(10);
          const hashedPass = await bcrypt.hash(password, salt);
  
          // Create the new user
          const newUser = new User({
              username,
              password: hashedPass,
              designation,
              profile: file || null, // If file is not uploaded, store null
          });
  
          // Save the new user to the database
          await newUser.save();
  
          // Send the response with the newly created user
          res.status(201).json(newUser);
  
      } catch (err) {
          console.log(err);
          res.status(500).json({ message: 'Internal Server Error', error: err });
      }
  });
  

//routes
app.use('/achievement',achievementRoute)
app.use('/contact',contactRoute)
app.use('/gallery',galleryRoute)
app.use('/interested',interestedtRoute)
app.use('/career',careerRoute)
app.use('/authentication',authenticationRoute)
app.use('/home',homeRoute)