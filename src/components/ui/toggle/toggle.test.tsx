import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Toggle } from "./toggle";

test("renders as switch role", () => {
  render(<Toggle />);
  expect(screen.getByRole("switch")).toBeInTheDocument();
});

test("off state has aria-checked false", () => {
  render(<Toggle checked={false} />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
});

test("on state has aria-checked true", () => {
  render(<Toggle checked={true} />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
});

test("on state has navy background", () => {
  render(<Toggle checked={true} />);
  expect(screen.getByRole("switch").className).toContain("bg-firm-navy");
});

test("off state has gray background", () => {
  render(<Toggle checked={false} />);
  expect(screen.getByRole("switch").className).toContain("bg-gray-300");
});

test("disabled toggle has disabled attribute", () => {
  render(<Toggle disabled />);
  expect(screen.getByRole("switch")).toBeDisabled();
});

test("onChange fires with new value on click", async () => {
  const onChange = vi.fn();
  render(<Toggle checked={false} onChange={onChange} />);
  await userEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenCalledWith(true);
});

test("onChange fires false when toggling off", async () => {
  const onChange = vi.fn();
  render(<Toggle checked={true} onChange={onChange} />);
  await userEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenCalledWith(false);
});

test("does not fire onChange when disabled", async () => {
  const onChange = vi.fn();
  render(<Toggle disabled onChange={onChange} />);
  await userEvent.click(screen.getByRole("switch"));
  expect(onChange).not.toHaveBeenCalled();
});

test("uncontrolled toggle starts with defaultChecked", () => {
  render(<Toggle defaultChecked={true} />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
});

test("uncontrolled toggle toggles on click", async () => {
  render(<Toggle defaultChecked={false} />);
  const toggle = screen.getByRole("switch");
  expect(toggle).toHaveAttribute("aria-checked", "false");
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-checked", "true");
});

test("has type button", () => {
  render(<Toggle />);
  expect(screen.getByRole("switch")).toHaveAttribute("type", "button");
});

test("forwards ref", () => {
  const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
  render(<Toggle ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
