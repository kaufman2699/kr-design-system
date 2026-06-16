import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Button } from "./button";

test("renders button with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
});

test("default variant applies navy background", () => {
  render(<Button variant="default">Primary</Button>);
  expect(screen.getByRole("button").className).toContain("bg-firm-navy");
});

test("accent variant applies lime background", () => {
  render(<Button variant="accent">Accent</Button>);
  expect(screen.getByRole("button").className).toContain("bg-firm-lime");
});

test("destructive variant applies destructive background", () => {
  render(<Button variant="destructive">Delete</Button>);
  expect(screen.getByRole("button").className).toContain("bg-firm-destructive");
});

test("outline variant applies border", () => {
  render(<Button variant="outline">Outline</Button>);
  expect(screen.getByRole("button").className).toContain("border");
});

test("ghost variant applies hover background", () => {
  render(<Button variant="ghost">Ghost</Button>);
  expect(screen.getByRole("button").className).toContain("hover:bg-gray-100");
});

test("sm size applies small height", () => {
  render(<Button size="sm">Small</Button>);
  expect(screen.getByRole("button").className).toContain("h-8");
});

test("lg size applies large height", () => {
  render(<Button size="lg">Large</Button>);
  expect(screen.getByRole("button").className).toContain("h-11");
});

test("disabled button has disabled attribute", () => {
  render(<Button disabled>Disabled</Button>);
  expect(screen.getByRole("button")).toBeDisabled();
});

test("click handler fires on click", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click</Button>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledOnce();
});

test("click handler does not fire when disabled", async () => {
  const onClick = vi.fn();
  render(<Button disabled onClick={onClick}>Click</Button>);
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).not.toHaveBeenCalled();
});

test("forwards ref to button element", () => {
  const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
  render(<Button ref={ref}>Ref</Button>);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});

test("merges custom className", () => {
  render(<Button className="my-custom-class">Custom</Button>);
  expect(screen.getByRole("button").className).toContain("my-custom-class");
});
