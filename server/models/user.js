const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    accountType:{
        type: String,
        required: true,
        enum: ['jobseeker', 'recruiter']
    },
    location:{
        type: String,
        required: function(){
            return this.accountType === 'jobseeker'
        }
    },
    skills:{
        type: String,
        required: function(){
            return this.accountType === "jobseeker";
        }
    },
    companyName:{
        type: String,
        required: function(){
            return this.accountType === "recruiter";
        }
    },
    companyWebsite:{
        type: String,
        required: function(){
            return this.accountType === "recruiter";
        }
    },
    industry:{
        type: String,
        required: function(){
            return this.accountType === "recruiter";
        }
    }
}, {timestamps: true});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", UserSchema)