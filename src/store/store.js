import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Importar los reducers
import whosThatPokemonReducer from './slices/whosThatPokemonSlice';
import memoryGameReducer from './slices/memoryGameSlice';
import typeMatcherReducer from './slices/typeMatcherSlice';

// Configuración de redux-persist
const persistConfig = {
  key: 'pokememory-root',
  version: 1,
  storage,
  // Solo persistir las mejores puntuaciones y estadísticas
  whitelist: ['whosThatPokemon', 'memoryGame', 'typeMatcher']
};

// Combinar reducers
const rootReducer = combineReducers({
  whosThatPokemon: whosThatPokemonReducer,
  memoryGame: memoryGameReducer,
  typeMatcher: typeMatcherReducer
});

// Crear reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurar store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Crear persistor
export const persistor = persistStore(store);
