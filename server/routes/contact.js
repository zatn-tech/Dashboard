const express = require('express')
const router = express.Router()
const Contact = require('../models/ContactModel')

router.post('/',async(req,res)=>{
    const {name,email,mobile,message} = req.body
    try
    {
        const contactObj = await Contact.create({
            name:name,
            mobile:mobile,
            email:email,
            message:message
        })
        if(!contactObj)
        {
            return res.status(401).json("Information not sent")
        }
        return res.status(200).json("Information sent. Will contcat you shortly. Thank you")
    }
    catch(err)
    {
        return res.status(500).json({error:err})
    }
})

router.get('/',async(req,res)=>{
    try{
        const contactObj = await Contact.find()
        if(!contactObj)
        {
            return res.status(401).json("No enquiry found")
        }
        return res.status(200).json(contactObj)
    }
    catch(err)
    {
        return res.status(500).json({error:err})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const {id} = req.params
        const contactObj = await Contact.findByIdAndDelete(id)
        if(!contactObj)
        {
            return res.status(401).json("Contact not deleted")
        }
        return res.status(201).json(contactObj)
    }
    catch(err)
    {
        return res.status(501).json({error:err})
    }
})

module.exports = router