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
