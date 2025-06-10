// app/page.test.tsx
import { render, screen } from '@testing-library/react';
import TaskEasyApp from './page';

describe('Home Page', () => {
  it('should display the main title "Aplikasi TaskEasy"', () => {
    render(<TaskEasyApp />);

    const titleElement = screen.getByText('Aplikasi TaskEasy');

    expect(titleElement).toBeInTheDocument();
  });
});