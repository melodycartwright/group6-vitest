import { http, HttpResponse } from "msw";

const API_BASE = "https://tokenservice-jwt-2025.fly.dev";

export const handlers = [
  http.post(`${API_BASE}/token-service/v1/request-token`, async () => {
    return new HttpResponse("mocked-token", { status: 200 });
  }),

  http.get(`${API_BASE}/movies`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (authHeader === "Bearer mocked-token") {
      return HttpResponse.json([
        { title: "The Matrix" },
        { title: "Inception" },
      ]);
    }

    return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
  }),
];
