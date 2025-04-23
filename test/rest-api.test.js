import axios from "axios";
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";

// Base URLs
const API_BASE = "https://tokenservice-jwt-2025.fly.dev";
const LOGIN_URL = `${API_BASE}/token-service/v1/request-token`;
const MOVIES_URL = `${API_BASE}/movies`;

let jwtToken;


beforeAll(async () => {
  try {
    const res = await axios.post(LOGIN_URL, {
      username: "group6testing",
      password: "securepass123",
    });
    jwtToken = res.data;
    console.log("JWT token fetched");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw new Error("Could not fetch JWT token");
  }
});

const api = () =>
  axios.create({
    baseURL: MOVIES_URL,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });


const createTestMovie = async (movieData) => {
  try {
    const res = await api().post("", movieData);
    return res.data;
  } catch (err) {
    console.error(
      "Failed to create movie:",
      err.response?.status,
      err.response?.data
    );
    throw new Error("Movie creation failed");
  }
};


describe("GET /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    createdMovie = await createTestMovie({
      title: "This is our movie",
      productionYear: 2023,
      description: "This movie was created to test the GET endpoint",
      director: "Group 6",
    });
  });

  afterEach(async () => {
    await api().delete(`/${createdMovie.id}`);
  });

  test("returns an array of movies", async () => {
    const res = await api().get("");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("returns one movie by ID", async () => {
    const res = await api().get(`/${createdMovie.id}`);
    expect(res.status).toBe(200);
    expect(res.data.title).toBe("This is our movie");
  });
});


describe("DELETE /movies", () => {
  let movie;

  beforeEach(async () => {
    movie = await createTestMovie({
      title: "This movie is made to delete",
      productionYear: 2022,
      description: "This movie will be deleted after this test runs.",
      director: "Group 6 delete",
    });
  });

  test("removes movie successfully", async () => {
    const res = await api().delete(`/${movie.id}`);
    expect(res.status).toBe(204);
  });
});


describe("POST and DELETE /movies", () => {
  test("creates and deletes a movie at once", async () => {
    const res = await api().post("", {
      title: "Temporary Movie",
      productionYear: 2024,
      description: "Testing create and delete in one test",
      director: "Group 6 post+delete",
    });

    expect(res.status).toBe(201);
    const movie = res.data;

    const deleteRes = await api().delete(`/${movie.id}`);
    expect(deleteRes.status).toBe(204);
  });
});

describe("PUT /movies", () => {
  let movie;

  beforeEach(async () => {
    movie = await createTestMovie({
      title: "Movie to update",
      productionYear: 2021,
      description: "A movie that will be updated",
      director: "Group 6 updater",
    });
  });

  afterEach(async () => {
    await api().delete(`/${movie.id}`);
  });

  test("updates the movie title", async () => {
    const updateRes = await api().put(`/${movie.id}`, {
      title: "Updated Title",
      productionYear: 2021,
      description: "Now this movie has updated info",
      director: "Group 6 updated",
    });

    expect(updateRes.status).toBe(200);

    const getRes = await api().get(`/${movie.id}`);
    expect(getRes.data.title).toBe("Updated Title");
  });
});
