import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import DigitalTwin from "./DigitalTwin";

describe("DigitalTwin", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens the chat and sends a starter question", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          answer: "I have AWS and Docker Swarm experience.",
        }),
      }),
    );

    render(<DigitalTwin />);

    await userEvent.click(
      screen.getByRole("button", { name: /ask me anything/i }),
    );

    expect(
      screen.getByRole("complementary", { name: /digital twin/i }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /what cloud skills does he have/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText("I have AWS and Docker Swarm experience."),
      ).toBeInTheDocument(),
    );

    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("does not send an empty message and closes the panel", async () => {
    render(<DigitalTwin />);

    await userEvent.click(
      screen.getByRole("button", { name: /ask me anything/i }),
    );

    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeDisabled();

    fireEvent.change(
      screen.getByRole("textbox", { name: /your question/i }),
      { target: { value: "What does Omar study?" } },
    );

    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeEnabled();

    const closeButtons = screen.getAllByRole("button", { name: /close chat/i });
    await userEvent.click(closeButtons[closeButtons.length - 1]);
    expect(
      screen.queryByRole("complementary", { name: /digital twin/i }),
    ).not.toBeInTheDocument();
  });
});
