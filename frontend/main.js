import './src/index.css';
import { initRouter } from './src/router.js';
import { initAuthState } from './src/state.js';

// Initialize Authentication State first
initAuthState();

// Initialize SPA Router
initRouter();
