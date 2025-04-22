import { http, HttpResponse } from 'msw';

const API_BASE = "https://tokenservice-jwt-2025.fly.dev";
//Fake api endpoints for handelrs
export const handlers = [
  http.post(`${API_BASE}/token-service/v1/request-token`, async () => {
    return new HttpResponse("mocked-token", { status: 200 });
  }),
  http.get(`${API_BASE}/movies`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (authHeader === 'Bearer mocked-token') {
        return HttpResponse.json([
            {title: 'Group 6 movie title'}
            {title: 'And another movie!'}
        ]);
    }
    return HttpResponse.json({ message: 'Forbidden'}, { status: 403});
  }),
];