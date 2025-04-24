import { http, HttpResponse } from "msw";

const API_BASE = "https://tokenservice-jwt-2025.fly.dev";

export const handlers = [
 
  http.post(`${API_BASE}/token-service/v1/request-token`, async () => {
    return new HttpResponse("mocked-token", { status: 200 });
  }),


  http.post(`${API_BASE}/movies`, async ({ request }) => {
    console.log('request intercepted')
    const newMovie = await request.json();
    return HttpResponse.json({ ...newMovie, id: Date.now() }, { status: 201 });
  }),


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

  http.put(`${API_BASE}/movies/:id`, async ({ request, params }) => {
    const updatedMovie = await request.json();
    return HttpResponse.json(
      { ...updatedMovie, id: Number(params.id) },
      { status: 200 }
    );
  }),


  http.delete(`${API_BASE}/movies/:id`, ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  }),


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
