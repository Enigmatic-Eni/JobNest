const express = require('express');
const router = express.Router();
// const {registerUser} = require('../controller/authController')
const User = require("../models/user")

router.post('/register', async(req, res)=>{
    try{
        const {firstname, lastname, email, password} = req.body
        // extract user information fromthe req.body
      
        
        // check if user already exists in the database
        const checkExistingUser = await User.findOne({ email});
        if(checkExistingUser){
            return res.status(400).json({
                success: false,
                message : "User with the same email or password already exists."
            })
        }

        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user and save in the database
        const newUser = new User({
            firstname,
            lastname,
            email,
            password : hashedPassword,
            role : role || "user"
        })

        await newUser.save()

        if(newUser){
            res.status(201).json({
                success: true,
                message : "User registered successfully"
            })
        }else{
            res.status(400).json({
                success: false,
                message : "Unable to register user, please try again"
            })
        }
    }catch(e){
       console.log(e);
       res.status(500).json({
        success : false,
        message : "Something went wrong, Please try again"
       }); 
       

    }
});

module.exports = router
