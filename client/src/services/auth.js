// @/services/auth.js
import API from '@/lib/api'; // Your API instance

export const signup = async (formData) => {

  
  const payload = {
    fullName: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    password: formData.password,
    phone: formData.phone
  };

  
    const response = await API.post('/auth/register', payload);
    return response.data;
 
};