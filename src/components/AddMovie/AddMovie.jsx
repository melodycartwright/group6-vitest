import { useState } from "react";
import axios from "axios";

const API_BASE = "https://tokenservice-jwt-2025.fly.dev";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwtToken = localStorage.getItem("jwtToken");
    const formData = {
      title,
      productionYear,
      description,
      director,
    };
    
    try {
      const response = await axios.post(`${API_BASE}/movies`, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('Response:', response);
      if (response.status === 201) {
        setMessage("Movie added successfully.");
      } else {
        setMessage(`Failed to add movie: ${response.statusText}`);
      }
    } catch (error) {
      setMessage("Failed to add movie.");
      console.error("Add movie error:", error.message);
    }
  };
  

  return (
    <div>
      <h2>Add Movie</h2>
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
  );
};

export default AddMovie;
