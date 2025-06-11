// jest.setup.js (atau jest.setup.ts)
// Ini adalah file setup global Anda

import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// Mock next/navigation (jika Anda menggunakan Next.js)
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ""
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}));

// Polyfill untuk PointerEvent methods (penting untuk Radix UI)
if (typeof window.HTMLElement.prototype.hasPointerCapture === 'undefined') {
  window.HTMLElement.prototype.hasPointerCapture = () => false;
}
if (typeof window.HTMLElement.prototype.releasePointerCapture === 'undefined') {
  window.HTMLElement.prototype.releasePointerCapture = () => {};
}

// Mock for matchMedia (jika digunakan oleh komponen UI seperti Radix)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});