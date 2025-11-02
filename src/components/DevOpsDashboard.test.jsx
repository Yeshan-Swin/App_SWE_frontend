import { render, screen } from "@testing-library/react";
import DevOpsDashboard from "./DevOpsDashboard";

describe("DevOpsDashboard", () => {
  it("displays setup guide steps", () => {
    render(<DevOpsDashboard />);

    expect(screen.getByRole("heading", { name: /DevOps Pipeline/i })).toBeInTheDocument();
    expect(screen.getByText("Setup Guide")).toBeInTheDocument();
    expect(screen.getByText("Setup guide for your pipeline")).toBeInTheDocument();
    expect(screen.getByText(/Configure GitHub Secrets/i)).toBeInTheDocument();
    expect(screen.getByText(/DEPLOYMENT_TOKEN/i)).toBeInTheDocument();
    expect(screen.getByText(/Trigger Your First Deploy/i)).toBeInTheDocument();
  });
});
