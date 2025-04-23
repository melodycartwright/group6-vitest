import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../src/components/movielist/MovieList";
import "whatwg-fetch";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
