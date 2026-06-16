import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ConfirmDialog } from "./confirm-dialog";

test("renders title", () => {
  render(<ConfirmDialog title="Delete?" description="Gone forever." />);
  expect(screen.getByRole("heading", { name: "Delete?" })).toBeInTheDocument();
});

test("renders description text", () => {
  render(<ConfirmDialog title="Confirm" description="Are you sure?" />);
  expect(screen.getByText("Are you sure?")).toBeInTheDocument();
});

test("renders ReactNode description", () => {
  render(
    <ConfirmDialog
      title="Delete"
      description={<>Remove <strong>Project</strong>?</>}
    />,
  );
  expect(screen.getByText("Project")).toBeInTheDocument();
});

test("renders confirm and cancel buttons with default labels", () => {
  render(<ConfirmDialog title="OK?" description="Check." />);
  expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

test("renders custom confirm and cancel labels", () => {
  render(
    <ConfirmDialog
      title="Save?"
      description="Save changes."
      confirmLabel="Save"
      cancelLabel="Discard"
    />,
  );
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
});

test("destructive variant applies destructive style to confirm button", () => {
  render(<ConfirmDialog title="Del" description="x" variant="destructive" confirmLabel="Delete" />);
  expect(screen.getByRole("button", { name: "Delete" }).className).toContain("bg-firm-destructive");
});

test("accent variant applies lime style to confirm button", () => {
  render(<ConfirmDialog title="Save" description="x" variant="accent" confirmLabel="Save" />);
  expect(screen.getByRole("button", { name: "Save" }).className).toContain("bg-firm-lime");
});

test("default variant applies navy style to confirm button", () => {
  render(<ConfirmDialog title="OK" description="x" variant="default" confirmLabel="OK" />);
  expect(screen.getByRole("button", { name: "OK" }).className).toContain("bg-firm-navy");
});

test("onConfirm fires when confirm clicked", async () => {
  const onConfirm = vi.fn();
  render(<ConfirmDialog title="X" description="Y" onConfirm={onConfirm} />);
  await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(onConfirm).toHaveBeenCalledOnce();
});

test("onCancel fires when cancel clicked", async () => {
  const onCancel = vi.fn();
  render(<ConfirmDialog title="X" description="Y" onCancel={onCancel} />);
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onCancel).toHaveBeenCalledOnce();
});

test("forwards ref to container div", () => {
  const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
  render(<ConfirmDialog ref={ref} title="X" description="Y" />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
});

test("merges custom className on container", () => {
  const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
  render(<ConfirmDialog ref={ref} title="X" description="Y" className="my-class" />);
  expect(ref.current?.className).toContain("my-class");
});
