const User = require("../models/user");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
  exports.updateUserProfile = async (req, res) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      }).select("-password");
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  exports.uploadDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.files && req.files.cv) {
      user.cv = req.files.cv[0].path; // e.g., "uploads/169xxxxx-file.pdf"
    }
    if (req.files && req.files.coverLetter) {
      user.coverLetter = req.files.coverLetter[0].path;
    }

    await user.save();
    res.json({ success: true, message: 'Files uploaded', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};