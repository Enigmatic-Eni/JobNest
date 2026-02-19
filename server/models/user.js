const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Sub-document: Job Seeker Info
const jobSeekerSchema = new mongoose.Schema({
  education: {
   institution: String,
   course: String,
  },
  experienceLevel: {
    type: String,
    enum: ["intern", "entry", "junior", "mid"],
    default: "entry"
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= 7,
      message: "Maximum of 7 skills allowed"
    }
  },
  preferences: {
  location: [String],
  jobTitles: [String],
  remote: Boolean,
  },
  bio:{
    type: String,
    maxLength: 500
  },
  links: {
    linkedin: String,
    portfolio: String,
  },
 documents:{
  baseCv:{
    filename: String,
    url: String,
    storagePath: String, 
    mimeType: String,
    uploadedAt: Date
  },
  coverLetter:{
    filename: String,
    url: String,
    storagePath: String, 
    mimeType: String,
    uploadedAt: Date
  }
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
    role: {
    type: String,
    enum: ["job_seeker"],
    default: "job_seeker"
  },

  profileCompleted: {
    type: Boolean,
    default: false
  },

 jobSeekerInfo: {
  type: jobSeekerSchema,
  default: {}
}
},
{
  timestamps: true
}
);

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
