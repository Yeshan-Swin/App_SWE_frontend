import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthModal from "./AuthModal";

describe("Auth Modal", () => {
  it("submits email + password", async () => {
    const onSubmit = vi.fn();

    render(<AuthModal open setShowAuth={() => {}} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/Email/i), "alice1@example.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "Secret123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalled();
  });
});