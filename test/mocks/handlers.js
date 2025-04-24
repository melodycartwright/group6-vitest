import { http, HttpResponse } from "msw";

const API_BASE = "https://tokenservice-jwt-2025.fly.dev";

export const handlers = [
  // 🔐 Mock login - returns a fake JWT token
  http.post(`${API_BASE}/token-service/v1/request-token`, async () => {
    return new HttpResponse("mocked-token", { status: 200 });
  }),

  // 🎥 Mock POST /movies - add a new movie
  http.post(`${API_BASE}/movies`, async ({ request }) => {
    const newMovie = await request.json();
    return HttpResponse.json({ ...newMovie, id: Date.now() }, { status: 201 });
  }),

  // 🎥 Mock GET /movies - return all movies
  http.get(`${API_BASE}/movies`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (authHeader === "Bearer mocked-token") {
      return HttpResponse.json([
        { id: 1, title: "The group 6 movie" },
        { id: 2, title: "movie number 2" },
      ]);
    }

    return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
  }),

  // 🎥 Mock GET /movies/:id - return one movie by ID
  http.get(`${API_BASE}/movies/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      {
        id,
        title: "This is our movie",
        productionYear: 2023,
        description: "Fetched by ID",
        director: "Group 6",
      },
      { status: 200 }
    );
  }),

  // ✏️ Mock PUT /movies/:id - update a movie
  http.put(`${API_BASE}/movies/:id`, async ({ request, params }) => {
    const updatedMovie = await request.json();
    return HttpResponse.json(
      { ...updatedMovie, id: Number(params.id) },
      { status: 200 }
    );
  }),

  // ❌ Mock DELETE /movies/:id - delete a movie
  http.delete(`${API_BASE}/movies/:id`, ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  }),

  // 🌐 OPTIONS /movies (CORS preflight)
  http.options(`${API_BASE}/movies`, () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Authorization,Content-Type",
      },
    });
  }),

  // 🌐 OPTIONS /movies/:id (CORS preflight)
  http.options(`${API_BASE}/movies/:id`, () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Authorization,Content-Type",
      },
    });
  }),
];
