import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateEventModal from "./CreateEventModal";

describe("CreateEventModal", () => {
  it("submits event details and resets the form", async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const slot = { start: "2024-01-02T10:00:00.000Z", end: "2024-01-02T11:00:00.000Z" };

    render(<CreateEventModal open onClose={onClose} onSubmit={onSubmit} slot={slot} />);

    await userEvent.type(screen.getByTestId("event-title-input"), "Weekly Sync");
    await userEvent.type(screen.getByTestId("event-description-input"), "Discuss progress");
    await userEvent.type(screen.getByTestId("event-location-input"), "Library Room 101");
    await userEvent.click(screen.getByTestId("create-event-submit-btn"));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Weekly Sync",
      description: "Discuss progress",
      location: "Library Room 101",
    });

    await waitFor(() => {
      expect(screen.getByTestId("event-title-input")).toHaveValue("");
      expect(screen.getByTestId("event-description-input")).toHaveValue("");
      expect(screen.getByTestId("event-location-input")).toHaveValue("");
    });
  });
});
