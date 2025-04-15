import { describe, test, expect, beforeAll, beforeEach, afterEach } from "vitest";

let jwtToken;

beforeAll(async () => {
  const res = await fetch('https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',    // ✅ Use working test credentials
      password: 'testpass'
    })
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('❌ Login failed:', error);
    throw new Error('Could not fetch JWT token');
  }

  jwtToken = await res.text();
  console.log('✅ JWT token fetched');
});

describe('GET /movies', () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch('https://tokenservice-rough-frost-9409.fly.dev/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Test Movie',
        productionYear: 2023,
        description: 'A test movie',
        director: 'Tester'
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Failed to create movie:', error);
      throw new Error('Movie creation failed in beforeEach');
    }

    createdMovie = await res.json();
  });

  afterEach(async () => {
    await fetch(`https://tokenservice-rough-frost-9409.fly.dev/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
  });

  test('GET /movies returns array', async () => {
    const res = await fetch('https://tokenservice-rough-frost-9409.fly.dev/movies', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /movies/:id returns correct movie', async () => {
    const res = await fetch(`https://tokenservice-rough-frost-9409.fly.dev/movies/${createdMovie.id}`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.title).toBe('Test Movie');
  });
});

describe('DELETE /movies', () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch('https://tokenservice-rough-frost-9409.fly.dev/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Delete Me',
        productionYear: 2022,
        description: 'To be deleted',
        director: 'Delete Director'
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Failed to create movie:', error);
      throw new Error('Movie creation failed in DELETE block');
    }

    createdMovie = await res.json();
  });

  test('DELETE /movies/:id removes the movie', async () => {
    const res = await fetch(`https://tokenservice-rough-frost-9409.fly.dev/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    expect(res.status).toBe(204);
  });
});

describe('POST and DELETE /movies', () => {
  test('should create and delete a movie', async () => {
    const postRes = await fetch('https://tokenservice-rough-frost-9409.fly.dev/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'One-time Movie',
        productionYear: 2021,
        description: 'Temporary',
        director: 'Flash'
      })
    });

    if (!postRes.ok) {
      const error = await postRes.text();
      console.error('❌ POST failed:', error);
      throw new Error('POST failed in single test');
    }

    const movie = await postRes.json();

    const deleteRes = await fetch(`https://tokenservice-rough-frost-9409.fly.dev/movies/${movie.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    expect(deleteRes.status).toBe(204);
  });
});
describe("PUT /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch(
      "https://tokenservice-rough-frost-9409.fly.dev/movies",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          title: "Old Title",
          productionYear: 2020,
          description: "Old desc",
          director: "Old Dir",
        }),
      }
    );
    createdMovie = await res.json();
  });

  afterEach(async () => {
    await fetch(
      `https://tokenservice-rough-frost-9409.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
  });

  test("should update movie title and confirm with GET", async () => {
    const updateRes = await fetch(
      `https://tokenservice-rough-frost-9409.fly.dev/movies/${createdMovie.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          title: "Updated Title",
          productionYear: 2020,
          description: "Old desc",
          director: "Old Dir",
        }),
      }
    );

    expect(updateRes.status).toBe(200);

    const getRes = await fetch(
      `https://tokenservice-rough-frost-9409.fly.dev/movies/${createdMovie.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const updatedMovie = await getRes.json();
    expect(updatedMovie.title).toBe("Updated Title");
  });
});
