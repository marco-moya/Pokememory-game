import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import memoryGameReducer from './store/slices/memoryGameSlice';
import typeMatcherReducer from './store/slices/typeMatcherSlice';
import whosThatPokemonReducer from './store/slices/whosThatPokemonSlice';

// Create a test store with default or custom initial state
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      memoryGame: memoryGameReducer,
      typeMatcher: typeMatcherReducer,
      whosThatPokemon: whosThatPokemonReducer
    },
    preloadedState
  });
}

// Custom render function that wraps components with providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
