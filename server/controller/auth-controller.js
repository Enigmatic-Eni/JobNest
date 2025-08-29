const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register endpoint

const registerUser = async (req, res) => {
  try {
    const {
      accountType,
      fullName,
      email,
      password,
      location,
      skills,
      companyName,
      companyWebsite,
      industry,
    } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User  with this email already exists",
      });
    }

    // Validate required fields
    if (!accountType || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Additional validation based on account type
    if (accountType === "jobseeker") {
      if (!location || !skills) {
        return res.status(400).json({
          success: false,
          message: "Location and skills are required for job seekers",
        });
      }
    } else if (accountType === "recruiter") {
      if (!companyName || !companyWebsite || !industry) {
        return res.status(400).json({
          success: false,
          message: "Company details are required for recruiters",
        });
      }
    }

    // Create user data object
    const userData = {
      fullName,
      email,
      password,
      accountType,
      ...(accountType === "jobseeker" && { location, skills }),
      ...(accountType === "recruiter" && {
        companyName,
        companyWebsite,
        industry,
      }),
    };

    const newUser = new User(userData);
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User  registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        accountType: newUser.accountType,
        ...(accountType === "jobseeker" && {
          location: newUser.location,
          skills: newUser.skills,
        }),
        ...(accountType === "recruiter" && {
          companyName: newUser.companyName,
          companyWebsite: newUser.companyWebsite,
          industry: newUser.industry,
        }),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration error",
      success: false,
    });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        accountType: user.accountType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user:{
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        ...(user.accountType === "jobseeker" &&{
          location: user.location,
          skills: user.skills
        }),
        ...(user.accountType === "recruiter" && {
          companyName: user.companyName,
          companyWebsite: user.companyWebsite,
          industry: user.industry
        })
      }
    })
  } catch (error) {
    console.error("Login error:" , error);
    res.status(500).json({
      success: false,
      message: "login error"
    })
  }
};

module.exports = { registerUser, loginUser };
