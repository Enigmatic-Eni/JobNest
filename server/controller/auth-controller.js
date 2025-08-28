const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register endpoint

const registerUser  = async (req, res) => {
  try {
    const { accountType, fullName, email, password, location, skills, companyName, companyWebsite, industry } = req.body;

    // Check for existing user
    const existingUser  = await User.findOne({ email: email.toLowerCase() });
    if (existingUser ) {
      return res.status(400).json({
        success: false,
        message: "User  with this email already exists"
      });
    }

    // Validate required fields
    if (!accountType || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields"
      });
    }

    // Additional validation based on account type
    if (accountType === "jobseeker") {
      if (!location || !skills) {
        return res.status(400).json({
          success: false,
          message: 'Location and skills are required for job seekers'
        });
      }
    } else if (accountType === "recruiter") {
      if (!companyName || !companyWebsite || !industry) {
        return res.status(400).json({
          success: false,
          message: 'Company details are required for recruiters'
        });
      }
    }

    // Create user data object
    const userData = {
      fullName,
      email,
      password,
      accountType,
      ...(accountType === 'jobseeker' && { location, skills }),
      ...(accountType === 'recruiter' && { companyName, companyWebsite, industry })
    };

    const newUser  = new User(userData);
    await newUser .save();

    return res.status(201).json({
      success: true,
      message: 'User  registered successfully',
      user: {
        id: newUser ._id,
        fullName: newUser .fullName,
        email: newUser .email,
        accountType: newUser .accountType,
        ...(accountType === 'jobseeker' && {
          location: newUser .location,
          skills: newUser .skills
        }),
        ...(accountType === 'recruiter' && {
          companyName: newUser .companyName,
          companyWebsite: newUser .companyWebsite,
          industry: newUser .industry
        })
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration error",
      success: false
    });
  }
};



// login controller
const loginUser = async(req, res)=>{
    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}

module.exports = {registerUser, loginUser}