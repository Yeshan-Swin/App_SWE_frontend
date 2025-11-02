import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthModal from "./AuthModal";
import api from "@/lib/api";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Auth Modal", () => {
  it("submits email + password", async () => {
    const onLogin = vi.fn();
    const onClose = vi.fn();
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({
      data: {
        access_token: "token-123",
        user: { id: 1, email: "alice1@example.com" },
      },
    });

    render(<AuthModal open onClose={onClose} onLogin={onLogin} />);

    await userEvent.type(screen.getByLabelText(/Email/i), "alice1@example.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "Secret123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith("token-123", expect.objectContaining({ id: 1 }));
    });
    expect(postSpy).toHaveBeenCalledWith("/auth/login", {
      email: "alice1@example.com",
      password: "Secret123",
      name: "",
    });
    expect(onClose).toHaveBeenCalled();

    postSpy.mockRestore();
  });
});
