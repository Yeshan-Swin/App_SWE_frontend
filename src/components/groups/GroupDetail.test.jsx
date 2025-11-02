import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GroupDetail from "./GroupDetail";
import api from "@/lib/api";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }) => (
    <button type="button" onClick={() => onSelect({ from: new Date("2024-01-01T10:00:00.000Z"), to: new Date("2024-01-02T12:00:00.000Z") })} data-testid="mock-calendar">
      calendar
    </button>
  ),
}));

vi.mock("@/components/schedule/CreateEventModal", () => ({
  __esModule: true,
  default: ({ open, slot, onSubmit }) =>
    open ? (
      <div data-testid="mock-create-event-modal">
        <span data-testid="modal-slot-start">{slot?.start}</span>
        <button type="button" onClick={() => onSubmit({ title: "Study Session", description: "Prep", location: "Library" })} data-testid="mock-create-event-submit">
          Confirm Event
        </button>
      </div>
    ) : null,
}));

const baseGroup = {
  id: 1,
  name: "Algorithms",
  owner_id: 10,
  members: [
    { id: 10, name: "Alice", email: "alice@example.com" },
    { id: 11, name: "Bob", email: "bob@example.com" },
  ],
};

describe("GroupDetail", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows members when members tab is selected", async () => {
    render(<GroupDetail group={baseGroup} onBack={vi.fn()} onUpdate={vi.fn()} />);

    await userEvent.click(screen.getByTestId("members-tab"));

    expect(screen.getByTestId("member-10")).toHaveTextContent("Alice");
    expect(screen.getByTestId("member-11")).toHaveTextContent("Bob");
  });

  it("invites members with provided emails", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValueOnce({});
    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce({ data: baseGroup });
    const onUpdate = vi.fn();

    render(<GroupDetail group={baseGroup} onBack={vi.fn()} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByTestId("members-tab"));
    await userEvent.type(screen.getByTestId("invite-emails-input"), "carol@example.com, dave@example.com");
    await userEvent.click(screen.getByTestId("send-invites-btn"));

    await waitFor(() =>
      expect(postSpy).toHaveBeenCalledWith("/groups/1/invite", { emails: ["carol@example.com", "dave@example.com"] })
    );
    expect(toast.success).toHaveBeenCalledWith("Invitations sent!");
    expect(onUpdate).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledWith("/groups/1");

    await waitFor(() => expect(screen.getByTestId("invite-emails-input")).toHaveValue(""));

    postSpy.mockRestore();
    getSpy.mockRestore();
  });

  it("finds available times and creates an event", async () => {
    const postSpy = vi.spyOn(api, "post").mockImplementation((url) => {
      if (url === "/schedule/suggest") {
        return Promise.resolve({
          data: [
            {
              start: "2024-01-03T10:00:00.000Z",
              end: "2024-01-03T11:00:00.000Z",
              coverage_ratio: 0.95,
              available_members: 2,
              total_members: 2,
            },
          ],
        });
      }
      if (url === "/schedule/create") {
        return Promise.resolve({ data: {} });
      }
      return Promise.resolve({ data: {} });
    });

    render(<GroupDetail group={baseGroup} onBack={vi.fn()} onUpdate={vi.fn()} />);

    const findTimesBtn = screen.getByTestId("find-times-btn");
    expect(findTimesBtn).toBeDisabled();

    await userEvent.click(screen.getByTestId("mock-calendar"));
    await waitFor(() => expect(findTimesBtn).toBeEnabled());

    await userEvent.click(findTimesBtn);

    await waitFor(() =>
      expect(postSpy).toHaveBeenCalledWith(
        "/schedule/suggest",
        expect.objectContaining({
          group_id: 1,
          duration_mins: 60,
        })
      )
    );

    expect(await screen.findByTestId("suggestion-0")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("create-event-btn-0"));
    expect(screen.getByTestId("mock-create-event-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-slot-start")).toHaveTextContent("2024-01-03T10:00:00.000Z");

    await userEvent.click(screen.getByTestId("mock-create-event-submit"));

    await waitFor(() =>
      expect(postSpy).toHaveBeenCalledWith(
        "/schedule/create",
        expect.objectContaining({
          group_id: 1,
          title: "Study Session",
        })
      )
    );
    expect(toast.success).toHaveBeenCalledWith("Event created successfully!");

    postSpy.mockRestore();
  });
});
