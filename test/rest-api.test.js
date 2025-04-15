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
    console.error("❌ Login failed:", error);
    throw new Error("Could not fetch JWT token");
  }

  jwtToken = await res.text();
  console.log("✅ JWT token fetched:", jwtToken);

  // Prevent race conditions in Vitest
  await new Promise((resolve) => setTimeout(resolve, 200));
});

// ========== GET /movies ==========
describe("GET /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    console.log("🔐 Using token (GET block):", jwtToken);
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Movie",
        productionYear: 2023,
        description: "This is a test movie.To test api functionality",
        director: "Test Director",
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Movie creation failed (GET block):", res.status, error);
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

  test("GET /movies returns array", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  test("GET /movies/:id returns correct movie", async () => {
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.title).toBe("Test Movie");
  });
});

// ========== DELETE /movies ==========
describe("DELETE /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    console.log("🔐 Using token (DELETE block):", jwtToken);
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Delete Me",
        productionYear: 2022,
        description: "To be deleted, used to test the api functionality",
        director: "Delete Director",
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error(
        "❌ Movie creation failed (DELETE block):",
        res.status,
        error
      );
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

// ========== POST and DELETE ==========
describe("POST and DELETE /movies", () => {
  test("should create and delete a movie", async () => {
    console.log("🔐 Using token (POST+DELETE block):", jwtToken);
    const postRes = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/movies",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Temp Movie",
          productionYear: 2024,
          description:
            "Created and deleted in one test and this is to test api",
          director: "One-Time Director",
        }),
      }
    );

    if (!postRes.ok) {
      const error = await postRes.text();
      console.error("❌ Movie POST failed:", postRes.status, error);
      throw new Error("POST failed");
    }

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

// ========== PUT and GET ==========
describe("PUT /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    console.log("🔐 Using token (PUT block):", jwtToken);
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
      console.error("❌ Movie creation failed (PUT block):", res.status, error);
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
