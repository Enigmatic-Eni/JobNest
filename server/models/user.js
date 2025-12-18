const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Sub-document: Student Info
const studentInfoSchema = new mongoose.Schema({
  programType: {
    type: String,
    enum: ["SIWES", "NYSC", null],
    required: false
  },
  institution: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  // fieldOfStudy: {
  //   type: String,
  //   trim: true
  // },
  // graduationYear: {
  //   type: Number
  // },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= 7,
      message: "Maximum of 7 skills allowed"
    }
  },
  statePreferences: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= 3,
      message: "Maximum of 3 state preferences allowed"
    }
  },
  deployedState: {
    type: String,
    trim: true
  },
  availableDuration: {
    type: String,
    enum: ["3 months", "6 months", "1 year", null]
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 500
  },
  linkedin: String,
  portfolio: String,
  documents: {
    cv: {
      filename: String,
      url: String,
      uploadedAt: Date
    },
    callUpLetter: {
      filename: String,
      url: String,
      uploadedAt: Date
    },
    itLetter: {
      filename: String,
      url: String,
      uploadedAt: Date
    },
    // transcript: {
    //   filename: String,
    //   url: String,
    //   uploadedAt: Date
    // }
  }
});

// Sub-document: Recruiter Info
const recruiterInfoSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true
  },
  companyWebsite: String,
  industry: {
    type: String,
    trim: true
  },
  location: {
    state: String,
    city: String,
    address: String
  },
  candidatePreference: {
    type: String,
    enum: ["SIWES", "NYSC", "Both", null],
    default: "Both"
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  companyLogo: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ["email_domain", "manual", "document", null]
  }
});

// MAIN USER MODEL
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  phone: {
    type: String
  },
  accountType: {
    type: String,
    required: true,
    enum: ["student", "recruiter"]
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  studentInfo: studentInfoSchema,
  recruiterInfo: recruiterInfoSchema
});

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
