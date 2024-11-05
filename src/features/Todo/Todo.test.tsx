import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import TodoForm from "./Todo";
import "@testing-library/jest-dom";

// Define proper types for the Button component props
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
};

// Define proper types for the Input component props
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  asChild?: boolean;
};

vi.mock("@/components/ui/button", () => ({
  Button: ({ ...props }: ButtonProps) => <button type="button" {...props} />,
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: InputProps) => <input {...props} />,
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (open ? <div data-testid="modal">{children}</div> : null),

  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-title">{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-description">{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="modal-ok" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("TodoForm", () => {
  beforeEach(() => {
    // Clear any previous renders
    vi.clearAllMocks();
  });

  it("renders the todo form", () => {
    render(<TodoForm />);
    expect(screen.getByPlaceholderText("Enter a new todo")).toBeInTheDocument();
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
  });

  it("shows error modal when submitting empty todo", async () => {
    render(<TodoForm />);

    const submitButton = screen.getByText("Add Todo");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-title")).toHaveTextContent("Error");
      expect(screen.getByTestId("modal-description")).toHaveTextContent(
        "Please enter a todo item"
      );
    });
  });

  it("adds a new todo when submitting valid input", async () => {
    render(<TodoForm />);

    const input = screen.getByPlaceholderText("Enter a new todo");
    const submitButton = screen.getByText("Add Todo");

    await userEvent.type(input, "Test todo");
    await userEvent.click(submitButton);

    // Check if todo is added to the list
    expect(screen.getByText("Test todo")).toBeInTheDocument();

    // Check success modal
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-title")).toHaveTextContent("Success");
      expect(screen.getByTestId("modal-description")).toHaveTextContent(
        "Todo added successfully!"
      );
    });
  });

  it("clears input after adding todo", async () => {
    render(<TodoForm />);

    const input = screen.getByPlaceholderText("Enter a new todo");
    const submitButton = screen.getByText("Add Todo");

    await userEvent.type(input, "Test todo");
    await userEvent.click(submitButton);

    expect(input).toHaveValue("");
  });

  it("trims whitespace from todo text", async () => {
    render(<TodoForm />);

    const input = screen.getByPlaceholderText("Enter a new todo");
    const submitButton = screen.getByText("Add Todo");

    await userEvent.type(input, "  Test todo  ");
    await userEvent.click(submitButton);

    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("closes modal when clicking OK button", async () => {
    render(<TodoForm />);

    // Trigger modal to appear by clicking "Add Todo" with empty input
    await userEvent.click(screen.getByText("Add Todo"));

    // Verify that the modal is open
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    // Click OK button inside the modal
    await userEvent.click(screen.getByTestId("modal-ok"));

    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("handles multiple todos", async () => {
    render(<TodoForm />);
    const input = screen.getByPlaceholderText("Enter a new todo");
    const submitButton = screen.getByText("Add Todo");

    // Add first todo
    await userEvent.type(input, "First todo");
    await userEvent.click(submitButton);

    // Add second todo
    await userEvent.type(input, "Second todo");
    await userEvent.click(submitButton);

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.getByText("Second todo")).toBeInTheDocument();
  });
});
