import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddMovie from "../src/components/AddMovie/AddMovie";
import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest";
import { server } from "./mocks/server";
import "whatwg-fetch";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
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
});
