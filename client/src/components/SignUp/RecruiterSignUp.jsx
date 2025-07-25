import axios from 'axios'
import React, { useState } from 'react'

function RecruiterSignUp() {
  const [values, setValues] = useState({
    firstname: '',
    lastname: "",
    email: "",
    password: ""
  })

//   const [firstname, setFirstname] = useState('');
// const [lastname, setLastname] = useState('');
// const [email, setEmail] = useState('');

  const handleChange = (e)=>{
    setValues({...values, [e.target.name]: [e.target.value]})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      
      const response = axios.post('http://localhost:3000/auth/register', values)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
     <div>
      <form onSubmit={handleSubmit}>
        <div className=' p-3'>
          <input type="text" placeholder='Enter  Firstname' name = "firstname" onChange={handleChange}/>
        </div>
        <div className=' p-3'>
          <input type="text" placeholder='Enter  Lastname' name="lastname" onChange={handleChange}/>
        </div>
        <div className=' p-3'>
          <input type="email" placeholder='Enter  Email' name='email' onChange={handleChange}/>
        </div>
        <div className=' p-3'>
          <input type="password" placeholder='Enter  Password' name='password' onChange={handleChange}/>
        </div>
        <button>Submit</button>
      </form>
     </div>
    </div>
  )
}

export default RecruiterSignUp