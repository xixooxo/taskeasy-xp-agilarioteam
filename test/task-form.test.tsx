import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../components/task-form'
import type { Task } from '@/app/page'

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select-component" data-value={value}>
      <button 
        type="button"
        onClick={() => onValueChange && onValueChange('test-value')}
        data-testid="select-trigger"
      >
        Select: {value || 'Choose option'}
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ value, children }: any) => (
    <div data-testid="select-item" data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger-wrapper">{children}</div>,
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
}))

// Mock data untuk testing
const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'high',
  status: 'in-progress',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('menampilkan semua field form dengan benar', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    })

    test('menampilkan placeholder text yang sesuai', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Describe the task in detail')).toBeInTheDocument()
    })

    test('menampilkan form kosong saat mode create', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement

      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
    })

    test('menampilkan select components', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const selectComponents = screen.getAllByTestId('select-component')
      expect(selectComponents).toHaveLength(2) // Priority and Status
    })
  })

  describe('Mode Edit', () => {
    test('mengisi form dengan data initial saat mode edit', () => {
      render(<TaskForm onSubmit={mockOnSubmit} initialData={mockTask} />)

      const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement

      expect(titleInput.value).toBe('Test Task')
      expect(descriptionInput.value).toBe('Test Description')
      expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    test('memanggil onCancel saat tombol cancel diklik', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} initialData={mockTask} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Form Validation', () => {
    test('menampilkan error saat title kosong', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    test('menampilkan error saat description kosong', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const titleInput = screen.getByLabelText(/task title/i)
      await user.type(titleInput, 'Test Title')

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    test('menampilkan multiple errors sekaligus', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)

      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    test('menghilangkan error setelah field diisi', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /create task/i })
      await user.click(submitButton)
      expect(screen.getByText('Title is required')).toBeInTheDocument()

      // Fill the field
      const titleInput = screen.getByLabelText(/task title/i)
      await user.type(titleInput, 'New Title')

      // Submit again to clear error
      await user.click(submitButton)
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    test('memanggil onSubmit dengan data yang benar saat form valid', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      // Fill form
      await user.type(screen.getByLabelText(/task title/i), 'New Task')
      await user.type(screen.getByLabelText(/description/i), 'New Description')

      // Submit form dengan default values
      await user.click(screen.getByRole('button', { name: /create task/i }))

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        priority: 'medium',
        status: 'to-do',
      })
    })

    test('mereset form setelah submit berhasil (mode create)', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      // Fill and submit form
      await user.type(screen.getByLabelText(/task title/i), 'New Task')
      await user.type(screen.getByLabelText(/description/i), 'New Description')
      await user.click(screen.getByRole('button', { name: /create task/i }))

      // Check form is reset
      const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
      
      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
    })

    test('tidak mereset form setelah submit berhasil (mode edit)', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} initialData={mockTask} />)

      // Submit form
      await user.click(screen.getByRole('button', { name: /update task/i }))

      // Check form is not reset (still has initial data)
      const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
      expect(titleInput.value).toBe('Test Task')
    })
  })

  describe('Reset Functionality', () => {
    test('mereset form saat tombol reset diklik (mode create)', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      // Fill form
      await user.type(screen.getByLabelText(/task title/i), 'Test Title')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      // Reset form
      await user.click(screen.getByRole('button', { name: /reset/i }))

      // Check form is reset
      const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
      
      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
    })

    test('menghilangkan error messages saat reset', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      // Trigger validation errors
      await user.click(screen.getByRole('button', { name: /create task/i }))
      expect(screen.getByText('Title is required')).toBeInTheDocument()

      // Reset form
      await user.click(screen.getByRole('button', { name: /reset/i }))

      // Check errors are cleared
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
      expect(screen.queryByText('Description is required')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('memiliki label yang benar untuk semua input', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByText('Task Title *')).toBeInTheDocument()
      expect(screen.getByText('Description *')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    test('menampilkan required indicator (*) untuk field wajib', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByText('Task Title *')).toBeInTheDocument()
      expect(screen.getByText('Description *')).toBeInTheDocument()
    })

    test('menggunakan border-red-500 untuk field dengan error', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: /create task/i }))

      const titleInput = screen.getByLabelText(/task title/i)
      expect(titleInput).toHaveClass('border-red-500')
    })
  })

  describe('Edge Cases', () => {
    test('menangani whitespace-only input sebagai invalid', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByLabelText(/task title/i), '   ')
      await user.type(screen.getByLabelText(/description/i), '   ')
      await user.click(screen.getByRole('button', { name: /create task/i }))

      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    test('menangani perubahan initialData setelah component di-mount', () => {
      const { rerender } = render(<TaskForm onSubmit={mockOnSubmit} />)

      // Initially empty
      const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement
      expect(titleInput.value).toBe('')

      // Update with initial data
      rerender(<TaskForm onSubmit={mockOnSubmit} initialData={mockTask} />)
      expect(titleInput.value).toBe('Test Task')
    })
  })
})