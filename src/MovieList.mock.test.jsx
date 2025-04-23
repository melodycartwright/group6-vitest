import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";
import { server } from "../test/mocks/server";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import MovieList from "./components/movielist/MovieList";
import "whatwg-fetch";
import { http } from "msw";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("MovieList", () => {
  it("should fetch and display movies on button click", async () => {

    // assemble
    // (no setup for this one, expecting the default answer from server.js)

    // act
    render(<MovieList />);
    let button = screen.getByText(/logga in och hämta filmer/i);
    await fireEvent.click(button);

    // assert
    let elem = await screen.findByText('The group 6 movie');
    expect(elem).toBeInTheDocument();

    elem = await screen.findByText('movie number 2');
    expect(elem).toBeInTheDocument();
  });

  it("should show error on token fetch failure", async () => {

    // assemble
    server.use(
      http.post("https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token", async () => {
        return new Response("Unauthorized", { status: 401 });
      })
    );

    // act
    render(<MovieList />);
    fireEvent.click(screen.getByText(/logga in och hämta filmer/i));

    // assert
    await waitFor(() =>
      expect(screen.getByText(/login failed/i)).toBeInTheDocument()
    );
  });

  it("should show error on movies fetch failure", async () => {
    // assemble
    server.use(
      http.get("https://tokenservice-jwt-2025.fly.dev/movies", async () => {
        return new Response(JSON.stringify({ message: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    // act
    render(<MovieList />);
    fireEvent.click(screen.getByText(/logga in och hämta filmer/i));

    // assert
    await waitFor(() =>
      expect(screen.getByText(/failed to fetch movies/i)).toBeInTheDocument()
    );
  });
});