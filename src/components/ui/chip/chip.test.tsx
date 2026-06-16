import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Chip } from "./chip";

test("renders chip with text", () => {
  render(<Chip>Filter</Chip>);
  expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
});

test("unselected state has gray background", () => {
  render(<Chip>Tag</Chip>);
  expect(screen.getByRole("button").className).toContain("bg-gray-100");
});

test("selected state has navy background", () => {
  render(<Chip selected>Active</Chip>);
  expect(screen.getByRole("button").className).toContain("bg-firm-navy");
});

test("selected state has white text", () => {
  render(<Chip selected>Active</Chip>);
  expect(screen.getByRole("button").className).toContain("text-white");
});

test("renders with icon", () => {
  const icon = <svg data-testid="icon" />;
  render(<Chip icon={icon}>With Icon</Chip>);
  expect(screen.getByTestId("icon")).toBeInTheDocument();
});

test("renders without icon", () => {
  render(<Chip>No Icon</Chip>);
  expect(screen.getByRole("button")).toBeInTheDocument();
});

test("disabled chip has disabled attribute", () => {
  render(<Chip disabled>Locked</Chip>);
  expect(screen.getByRole("button")).toBeDisabled();
});

test("click handler fires on click", async () => {
  const onClick = vi.fn();
  render(<Chip onClick={onClick}>Click</Chip>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledOnce();
});

test("click does not fire when disabled", async () => {
  const onClick = vi.fn();
  render(<Chip disabled onClick={onClick}>Click</Chip>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).not.toHaveBeenCalled();
});

test("has type button (no form submission)", () => {
  render(<Chip>Tag</Chip>);
  expect(screen.getByRole("button")).toHaveAttribute("type", "button");
});

test("merges custom className", () => {
  render(<Chip className="extra">Tag</Chip>);
  expect(screen.getByRole("button").className).toContain("extra");
});
