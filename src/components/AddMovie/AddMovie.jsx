import { useState } from "react";
import axios from "axios"

const API_BASE = 'https://tokenservice-jwt-2025.fly.dev';
const response = await axios.post(`${API_BASE}/token-service/v1/request-token`, {
  username: "USER",
  password: "password"
});
const jwtToken = "eyJraWQiOiI2ODJhNDUzMi1iZjA5LTRmMDYtODFkZi02Mjk2MWQ5YmJlZWMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiVVNFUiIsImV4cCI6MTc0NTQ2MTYyMywiaWF0IjoxNzQ1NDU4MDIzLCJzY29wZSI6IlVTRVIifQ.N0yO1UTN1IS4qgEp9kFBg2BLhaVicjyJTF7x0jcglaevnQr8JhulZrOYfBYXP--Y2zIGoI2jcQQ7d-jbAcXmLFoztlvHj1SVMbu_BpNgrru3ktcSafBiHFzdPhQJ5uCEehXexD7rqMQnGXc1CffEqXs6o9W6LsKHOWBds_5UZo_XP6J7kyWk_WoPrtQ8g0PV3Im0gtbSqtCLn2fV1YLBtDhNW3iX13vAwhWjGvkw6sedqt81KQdycMe_nHfQaE07g15kQEC2wcPhGldh3cFdwwM4uggjeOd92XGhX-cW2IFXJ9mBzOerxW60qbnL5MtLHuvM8aOyUU9rzNMYVQKGLQ";
const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [productionYear, setProductionYear] = useState('');
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      productionYear,
      description,
      director
    };
    console.log(formData);
    try {
      const response = await axios.post(`${API_BASE}/movies`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
      });
      console.log('Response:', response);
      if (response.status === 201) {
        setMessage('Movie added successfully');
      } else {
        setMessage(`Failed to add movie: ${response.statusText}`);
      }
    } catch (error) {
      setMessage('Failed to add movie');
    }
    console.log(message);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
         value={title} 
         onChange={(e) => setTitle(e.target.value)} 
         placeholder="Title" 
        />
        <input
         value={productionYear} 
         onChange={(e) => setProductionYear(e.target.value)} 
         placeholder="Production Year" 
        />
        <input 
         value={description} 
         onChange={(e) => setDescription(e.target.value)} 
         placeholder="Description" 
        />
        <input 
         value={director} 
         onChange={(e) => setDirector(e.target.value)} 
         placeholder="Director" 
        />
        <button type="submit">Add Movie</button>
      </form>
       {message && <p>{message}</p>}
    </div>
  )
}
export default AddMovie
