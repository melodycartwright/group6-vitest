import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";
import { server } from "./mocks/server";
import { http } from "msw";
import AddMovie from "../src/components/AddMovie/AddMovie";

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("AddMovie", () => {

  it("shows success message after adding a movie", async () => {
    render(<AddMovie />);

    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: "The group 6 movie" },
    });
    fireEvent.change(screen.getByPlaceholderText(/production year/i), {
      target: { value: "2023" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "The group 6 movie description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/director/i), {
      target: { value: "John Doe" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => {
      expect(screen.getByText(/movie added successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error message when failing to add a movie", async () => {
    server.use(
        http.post("https://tokenservice-jwt-2025.fly.dev/movies", (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    render(<AddMovie />);

    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: "The group 6 movie" },
    });
    fireEvent.change(screen.getByPlaceholderText(/production year/i), {
      target: { value: "2023" },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "The group 6 movie description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/director/i), {
      target: { value: "John Doe" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add movie/i)).toBeInTheDocument();
    })
  })
});
