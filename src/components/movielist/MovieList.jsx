import React from "react";
import { useState } from "react";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const loginAndFetch = async () => {
    try {
      const response = await fetch(
        "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "jonatangron",
            password: "jonatan",
          }),
        }
      );

      if (!response.ok) throw new Error("Login failed");

      const token = await response.text();
      setToken(token);

      const moviesResponse = await fetch(
        "https://tokenservice-jwt-2025.fly.dev/movies",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!moviesResponse.ok) throw new Error("Failed to fetch movies");

      const moviesData = await moviesResponse.json();
      setMovies(moviesData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={loginAndFetch}>Logga in och hämta filmer</button>
      {error && <p>{error}</p>}
      <ul>
        {movies.map((b, i) => (
          <li key={i}>
            <strong>{b.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MovieList;
