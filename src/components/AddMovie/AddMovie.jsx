import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://tokenservice-jwt-2025.fly.dev";

const AddMovie = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [title, setTitle] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          `${API_BASE}/token-service/v1/request-token`,
          {
            username: "USER",
            password: "password",
          }
        );
        setJwtToken(response.data);
      } catch (err) {
        console.error("Token fetch failed:", err.message);
      }
    };

    fetchToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      productionYear,
      description,
      director,
    };
  
    
    try {
      const response = await axios.post(`${API_BASE}/movies`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

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
