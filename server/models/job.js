const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    companySlug:{
        type: String,
        required: true
    },
    location:{
        type: String,
        default: "Not Specified"
    },
    description:{
        type: String,
        default: "",
    },
    applyUrl:{
        type: String,
        required: true,
    },
    source:{
        type: String,
        enum: ["greenhouse", "arbeitnow", "remotive",],
        required: true
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    externalId:{
        type: String,
        required: true,
    },
    scrapedAt:{
        type: Date,
        default: Date.now
    }
}, {timestamps: true});


jobSchema.index({externalId: true, source: true}, {unique: true});

module.exports = mongoose.model("Job", jobSchema);