const User = require('../models/UserModel');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const secret = process.env.SECRET;

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }

    // Compare the provided password with the stored hash
    const verifyPass = await bcrypt.compare(password, foundUser.password);
    if (!verifyPass) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expiration time (1 hour)
        username: foundUser.username,
        id: foundUser._id,
      },
      secret
    );

    // Set cookies with the user data and token
    res.cookie('user', JSON.stringify({
      username: foundUser.username,
      designation: foundUser.designation, // Add other necessary fields
    }), {
      secure: true, // Requires HTTPS in production
      sameSite: 'None', // For cross-origin cookies
      httpOnly: true, // Secure cookie flag
    });

    res.cookie('token', token, {
      secure: true, // Requires HTTPS in production
      sameSite: 'None',
      httpOnly: true, // Secure cookie flag
    });

    // Send a success response
    return res.status(200).json({ message: 'Logged in successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/logout', async (req, res) => {
    try {
        res.cookie('user', '', {
            secure: true,
            sameSite: "none",
            httpOnly: false,

        })
        res.cookie('token', '', {
            secure: true,
            sameSite: "none",
            httpOnly: false,

        }).json('logged out')
    }
    catch(err){
        res.status(400).json({"message":err})
    }
})

router.get('/',async(req,res)=>{
    const {token}=req.cookies
    if(!token)return res.status(400).json('sign in to continue')
    try{
        jwt.verify(token,secret,{},(err,info)=>{
            if(err)throw err
            res.json(info)
        })
    }catch(err){
        res.status(400).json('token expired')
    }
})

module.exports = router;
