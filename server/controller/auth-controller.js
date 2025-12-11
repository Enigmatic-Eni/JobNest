
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/*Generate JWT token for authenticated user*/
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET_KEY,
    { expiresIn: '7d' }
  );
};

/* Get public-safe user profile (removes sensitive data)*/
const getPublicProfile = (user) => {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
    profileCompleted: user.profileCompleted,
    ...(user.accountType === 'student' && user.studentInfo && {
      studentInfo: user.studentInfo
    }),
    ...(user.accountType === 'recruiter' && user.recruiterInfo && {
      recruiterInfo: user.recruiterInfo
    })
  };
};

// ============================================
// AUTH CONTROLLERS
// ============================================

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, accountType, phone } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password, and account type are required"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Validate account type
    if (!['student', 'recruiter'].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type. Must be 'student' or 'recruiter'"
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      accountType,
      phone: phone || undefined,
      profileCompleted: false
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: getPublicProfile(user),
      needsProfileCompletion: true
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user (including password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: getPublicProfile(user),
      needsProfileCompletion: !user.profileCompleted
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


module.exports = {
  registerUser,
  loginUser
};