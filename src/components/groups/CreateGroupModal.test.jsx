import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateGroupModal from "./CreateGroupModal";

describe("CreateGroupModal", () => {
  it("submits the entered group name", async () => {
    const onClose = vi.fn();
    const onCreate = vi.fn().mockResolvedValueOnce({});

    render(<CreateGroupModal open onClose={onClose} onCreate={onCreate} />);

    const input = screen.getByTestId("group-name-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Frontend Wizards");
    await userEvent.click(screen.getByTestId("create-group-submit-btn"));

    expect(onCreate).toHaveBeenCalledWith("Frontend Wizards");
    await waitFor(() => expect(input).toHaveValue(""));
  });
});
