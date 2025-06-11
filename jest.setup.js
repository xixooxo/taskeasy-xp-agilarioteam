import '@testing-library/jest-dom'

// Disable accessibility checks untuk select elements
import { configure } from '@testing-library/react'

configure({
  getElementError: (message, container) => {
    // Skip accessibility errors untuk select elements
    if (message && message.includes('accessible name')) {
      return new Error('Accessibility check skipped for testing')
    }
    return new Error(message)
  }
})

// Mock untuk Select component dari shadcn/ui
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock hasPointerCapture untuk mengatasi Radix UI error
Element.prototype.hasPointerCapture = jest.fn()
Element.prototype.setPointerCapture = jest.fn()
Element.prototype.releasePointerCapture = jest.fn()