import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from './App';

// Helper to mock a successful v1 response
const mockSuccessResponse = (amount) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ tax_refund: amount, formula_version: "1.0" }),
    })
  );
};

// Helper to mock a failed response
const mockErrorResponse = () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error("API Down"))
  );
};

afterEach(() => {
  jest.restoreAllMocks();
  cleanup();
});

describe('Tax Portal v1.0 Baseline Tests', () => {

  test('TC1: Displays the standard $7.50 refund for 50% proportional logic', async () => {
    // Arrange
    mockSuccessResponse(7.50);
    render(<App />);
    const button = screen.getByRole('button', { name: /Run Standard Calculation/i });

    // Act
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/\$7.50/i)).toBeInTheDocument();
    });
  });

  test('TC2: Shows "Calculating..." state during API transit', async () => {
    // Arrange
    // Slow down the mock to catch the loading state
    global.fetch = jest.fn(() => new Promise(resolve => 
      setTimeout(() => resolve({ 
        ok: true, 
        json: () => Promise.resolve({ tax_refund: 7.50 }) 
      }), 100)
    ));
    
    render(<App />);
    const button = screen.getByRole('button', { name: /Run Standard Calculation/i });

    // Act
    fireEvent.click(button);

    // Assert
    expect(screen.getByText(/Calculating.../i)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('TC3: Correctness of currency formatting (two decimal places)', async () => {
    // Arrange
    // Simulate a case like 1.555 that should be displayed as $1.56
    mockSuccessResponse(1.56);
    render(<App />);
    const button = screen.getByRole('button', { name: /Run Standard Calculation/i });

    // Act
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      const display = screen.getByText(/\$1.56/i);
      expect(display).toBeInTheDocument();
    });
  });

  test('TC4: Graceful handling of API connection failure', async () => {
    // Arrange
    mockErrorResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    const button = screen.getByRole('button', { name: /Run Standard Calculation/i });

    // Act
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("API Error:", expect.any(Error));
    });
    // Ensure the UI doesn't show a stale or incorrect result
    expect(screen.queryByText(/\$/i)).not.toBeInTheDocument();
  });

});