import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";

let jwtToken;

beforeAll(async () => {
  const res = await fetch(
    "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "group6testing",
        password: "securepass123",
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Login failed:", error);
    throw new Error("Could not fetch JWT token");
  }

  jwtToken = await res.text();

  await new Promise((resolve) => setTimeout(resolve, 200));
});

describe("GET /movies, return movies and the created one", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "In time travel",
        productionYear: 2023,
        description:
          "This movie is about a worl were everyone has a clock on there arm and when the clock runs out you die",
        director: "The director",
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Movie creation failed (GET block):", res.status, error);
      throw new Error("Failed to create test movie");
    }

    createdMovie = await res.json();
  });

  afterEach(async () => {
    await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
  });

  test("GET /movies returns array with movies, testing statuscode and array length ", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.length).toBe(1);
    expect(Array.isArray(data)).toBe(true);
  });

  test("GET /movies/:id returns a single movie, testing statuscode, and title", async () => {
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.title).toBe("In time travel");
  });
});

describe("DELETE /movies:id , removing created movie ", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Avatar",
        productionYear: 2022,
        description:
          "This movie is about a world where humans are trying to take over the planet",
        director: "Avatar Director Ben",
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Movie creation failed (DELETE block):", res.status, error);
      throw new Error("Failed to create test movie");
    }

    createdMovie = await res.json();
  });

  test("DELETE /movies/:id removes the movie", async () => {
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(res.status).toBe(204);
  });
});

describe("POST and DELETE /movies, create movie and then remove it without hooks", () => {
  test("creates a movie and deletes it successfully", async () => {
    const postRes = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/movies",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "the flying drangonkiller",
          productionYear: 2024,
          description:
            "A movie about a dragoonhunter who is trying to kill a dragon",
          director: "Sven Affleck Sverkersson",
        }),
      }
    );

    if (!postRes.ok) {
      const error = await postRes.text();
      console.error("Movie POST failed:", postRes.status, error);
      throw new Error("POST failed");
    }
    expect(postRes.status).toBe(201);

    const movie = await postRes.json();

    const deleteRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${movie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(deleteRes.status).toBe(204);
  });
});

describe("PUT /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Old Title",
        productionYear: 2021,
        description: "This movie was created to test the API's functionality.",
        director: "Old Director",
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Movie creation failed (PUT block):", res.status, error);
      throw new Error("Failed to create test movie");
    }

    createdMovie = await res.json();
  });

  afterEach(async () => {
    await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
  });

  test("should update movie title and confirm with GET", async () => {
    const updateRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Updated Title",
          productionYear: 2021,
          description:
            "This movie was created to test the API's functionality.",
          director: "Old Director",
        }),
      }
    );

    expect(updateRes.status).toBe(200);

    const getRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );

    const updatedMovie = await getRes.json();
    expect(updatedMovie.title).toBe("Updated Title");
  });
});
