import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for react-router and other libraries that use TextEncoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
