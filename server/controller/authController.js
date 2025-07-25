const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log("Registering:", firstname);
  return res.status(201).json({ message: 'User registered successfully' });
};

module.exports = {registerUser};
