

// register endpoint

const registerUser = async(req, res)=>{
 const { firstname, lastname, email, password } = req.body;
  console.log("Registering:", firstname);
  return res.status(201).json({ message: 'User registered successfully' });
}


// login controller
const loginUser = async(req, res)=>{
    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}

module.exports = {registerUser, loginUser}