import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import api from "@/lib/api";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/components/groups/CreateGroupModal", () => ({
  __esModule: true,
  default: ({ open, onCreate }) =>
    open ? (
      <div data-testid="mock-create-group-modal">
        <button onClick={() => onCreate("New Group Name")} data-testid="mock-create-group-confirm">
          Save Group
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/groups/GroupDetail", () => ({
  __esModule: true,
  default: ({ group, onBack }) => (
    <div data-testid="mock-group-detail">
      <span>{group.name}</span>
      <button onClick={onBack} data-testid="mock-group-detail-back">
        Back
      </button>
    </div>
  ),
}));

const baseGroups = [
  {
    id: 1,
    name: "Algorithms",
    members: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
  },
];

describe("Dashboard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays groups then opens group detail", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce({ data: baseGroups });
    const user = { name: "Test User" };
    const onLogout = vi.fn();

    render(<Dashboard user={user} onLogout={onLogout} />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId("group-card-1")).toBeInTheDocument());

    expect(getSpy).toHaveBeenCalledWith("/groups");
    expect(screen.getByText("Test User")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("group-card-1"));
    expect(screen.getByTestId("mock-group-detail")).toHaveTextContent("Algorithms");

    await userEvent.click(screen.getByTestId("mock-group-detail-back"));
    expect(screen.getByTestId("group-card-1")).toBeInTheDocument();

    getSpy.mockRestore();
  });

  it("creates a new group from the modal", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce({ data: baseGroups });
    const postSpy = vi.spyOn(api, "post").mockResolvedValueOnce({
      data: {
        id: 2,
        name: "New Group Name",
        members: [],
      },
    });

    render(<Dashboard user={{ name: "Test User" }} onLogout={vi.fn()} />);

    await waitFor(() => expect(screen.getByTestId("group-card-1")).toBeInTheDocument());

    await userEvent.click(screen.getByTestId("create-group-btn"));
    expect(screen.getByTestId("mock-create-group-modal")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("mock-create-group-confirm"));

    await waitFor(() => expect(postSpy).toHaveBeenCalledWith("/groups", { name: "New Group Name" }));
    await waitFor(() => expect(screen.getByTestId("group-card-2")).toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Group created successfully!");

    getSpy.mockRestore();
    postSpy.mockRestore();
  });

  it("switches to the DevOps view when selected", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce({ data: baseGroups });

    render(<Dashboard user={{ name: "Test User" }} onLogout={vi.fn()} />);

    await waitFor(() => expect(screen.getByTestId("group-card-1")).toBeInTheDocument());

    await userEvent.click(screen.getByTestId("nav-devops-tab"));

    expect(screen.getByRole("heading", { name: /DevOps Pipeline/i })).toBeInTheDocument();

    getSpy.mockRestore();
  });
});
