import "@testing-library/jest-dom";
import { vi } from "vitest";

// Add any global test setup here
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
