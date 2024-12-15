const express = require('express')
const router = express.Router()
const Interested = require('../models/InterestedModel')

router.post('/', async (req, res) => {
    try {
        let interestObj = await Interested.create({
            count:1,
        }); 
            if (!interestObj) {
                return res.status(400).json("Error creating count");
            }
            return res.status(200).json("Count Created");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});


router.get('/',async(req,res)=>{
    try{
        const count = await Interested.findOne()
        if(!count)
        {
            return res.status(400).json("Count not found")
        }
        return res.status(201).json(count)
    }
    catch(err)
    {
        return res.status(500).json(err)
    }
})

module.exports = router