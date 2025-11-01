import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  it("triggers auth flow from both call-to-action buttons", async () => {
    const onShowAuth = vi.fn();

    render(<LandingPage onShowAuth={onShowAuth} />);

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await userEvent.click(screen.getByRole("button", { name: /get started free/i }));

    expect(onShowAuth).toHaveBeenCalledTimes(2);
  });
});
