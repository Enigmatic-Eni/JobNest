

const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/documents/");
    },
    filename: (req, file, cb)=>{
        const userId = req.userInfo.userId;
        const timestamp = Date.now();
        const extension = path.extname(file.originalname)
        cb(null, `${userId}_${timestamp}${extension}`);
    }
})

const fileFilter = (req, file, cb) =>{
     const allowedTypes = [
    "application/pdf",           
    "image/jpeg",                
    "image/png",                
    "application/msword",       
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = upload;