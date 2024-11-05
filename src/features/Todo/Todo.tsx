import React, { useState, FormEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface ModalMessage {
  title: string;
  description: string;
}

interface TodoState {
  todos: Todo[];
  newTodo: string;
  showModal: boolean;
  modalMessage: ModalMessage;
}

const INITIAL_STATE: TodoState = {
  todos: [],
  newTodo: "",
  showModal: false,
  modalMessage: { title: "", description: "" },
};

const TodoForm: React.FC = () => {
  const [{ todos, newTodo, showModal, modalMessage }, setState] =
    useState<TodoState>(INITIAL_STATE);

  const updateState = (updates: Partial<TodoState>): void => {
    setState((current) => ({ ...current, ...updates }));
  };

  const displayModal = (message: ModalMessage): void => {
    updateState({
      showModal: true,
      modalMessage: message,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!newTodo.trim()) {
      displayModal({
        title: "Error",
        description: "Please enter a todo item",
      });
      return;
    }

    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
    };

    updateState({
      todos: [...todos, newTodoItem],
      newTodo: "",
      modalMessage: {
        title: "Success",
        description: "Todo added successfully!",
      },
      showModal: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateState({ newTodo: e.target.value });
  };

  const handleModalChange = (open: boolean): void => {
    updateState({ showModal: open });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
                placeholder="Enter a new todo"
                className="flex-1"
                aria-label="New todo input"
              />
              <Button type="submit">Add Todo</Button>
            </div>
          </form>

          <div className="mt-4 space-y-2">
            {todos.map((todo: Todo) => (
              <div
                key={todo.id}
                className="p-2 bg-gray-100 rounded"
                role="listitem"
              >
                {todo.text}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showModal} onOpenChange={handleModalChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{modalMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {modalMessage.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleModalChange(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TodoForm;
