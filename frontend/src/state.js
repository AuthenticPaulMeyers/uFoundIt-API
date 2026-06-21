// Global store for authentication and user profile state
export const state = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

// Listeners helper for subscription to state changes
const listeners = new Set();

export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  // Dispatch standard window event for global components (like header)
  window.dispatchEvent(new CustomEvent('auth-change', { detail: { ...state } }));
  // Call programmatic subscribers
  for (const callback of listeners) {
    callback({ ...state });
  }
}

// Check if token is expired (decoded payload client-side check)
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    // Current time in seconds
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true; // If invalid format, treat as expired
  }
}

export function initAuthState() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const cachedUser = localStorage.getItem('user_profile');

  state.accessToken = accessToken;
  state.refreshToken = refreshToken;

  if (cachedUser) {
    try {
      state.user = JSON.parse(cachedUser);
    } catch (e) {
      state.user = null;
    }
  }

  // Determine auth status
  if (accessToken && refreshToken) {
    state.isAuthenticated = !isTokenExpired(accessToken) || !isTokenExpired(refreshToken);
  } else {
    state.isAuthenticated = false;
  }

  notify();
}

export function setAuthState({ accessToken, refreshToken, user }) {
  if (accessToken) {
    state.accessToken = accessToken;
    localStorage.setItem('access_token', accessToken);
  }
  if (refreshToken) {
    state.refreshToken = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
  }
  if (user) {
    state.user = user;
    localStorage.setItem('user_profile', JSON.stringify(user));
  }

  state.isAuthenticated = true;
  notify();
}

export function clearAuthState() {
  state.accessToken = null;
  state.refreshToken = null;
  state.user = null;
  state.isAuthenticated = false;

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');

  notify();
}
