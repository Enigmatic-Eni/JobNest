const express = require('express')
const router = express.Router()
const multer = require('multer')

const {
  getUserProfile,
  updateUserProfile,
  uploadDocuments
} = require('../controller/profile-controller');

// Multer storage to uploads/ directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // safe unique filename
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage });

// GET /profile/:id
router.get('/:id', getUserProfile);

// PUT /profile/:id
router.put('/:id', updateUserProfile);

// POST /profile/upload/:id  -> fields: cv, coverLetter
router.post('/upload/:id', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'coverLetter', maxCount: 1 }]), uploadDocuments);

module.exports = router;