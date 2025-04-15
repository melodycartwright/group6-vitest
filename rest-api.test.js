import { describe, test, expect, beforeAll } from "vitest";

let jwtToken;
// This runs once before all test suites
beforeAll(async () => {
  const res = await fetch('https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'your_username',
      password: 'your_password'
    })
  });
  jwtToken = await res.text();
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

