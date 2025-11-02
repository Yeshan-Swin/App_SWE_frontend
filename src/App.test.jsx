import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App root", () => {
  it("renders landing page", () => {
    render(<App />);
    expect(screen.getByText(/Find the Perfect Time/i)).toBeInTheDocument();
  });

  it("opens auth modal when clicking Sign In", async () => {
    render(<App />);

    const signInBtn = screen.getAllByRole("button", { name: /sign in/i })[0];
    await userEvent.click(signInBtn);

    expect(
      screen.getByText(/Welcome Back/i)
    ).toBeInTheDocument();
  });
});
