This document outlines the design and step-by-step plan for building the single-page application (SPA) frontend for the uFoundIt Campus Lost & Found platform. The frontend will be built using Vite and Vanilla JavaScript, remaining strictly decoupled from the Django REST Framework backend.

Follow the consistency in design decision as proposed by the UI templates. Remove any unnecessary features included in the templates that will not be needed in this design. 

Colours, fonts, spaces, boxes, should be consistent throughout the design.

# Phase 1

### Required 

> - **CORS Configuration**: The Django backend is currently configured to accept local requests from `http://localhost:3000` and `http://localhost:8000`. By default, Vite runs on `http://localhost:5173` (or `http://localhost:3000` depending on port availability). Edit the `.env` file in the backend where configuration includes the correct Vite URL in `CORS_ALLOWED_ORIGINS`.

**Multi-page HTMLs to SPA Transition**: The mockups in `templates/` represent distinct pages (e.g. `index.html`, `login-page.html`, `user-dashboard-page.html`). Transition this structure to a dynamic SPA by creating component templates (or dynamic page loaders) in Vanilla JS that swap the main section contents of a single entry page, sharing a common navigation header/footer.

> - **JWT Persistence**: Store JWT tokens `sessionStorage` for temporary, session-scoped logins.


## Proposed Changes
Introduce a new frontend directory and make minor configuration updates to the backend to support CORS and asset management.

### 1. Frontend SPA Initialization

#### [frontend/package.json](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/package.json)
- Create Vite vanilla JS app with script dependencies: Tailwind CSS, PostCSS, Autoprefixer.

#### [frontend/vite.config.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/vite.config.js)
- Configure Vite development server:
  - Add proxy settings for `/api/` pointing to `http://localhost:8000/api/` to avoid CORS issues during development.
  - Set up build/asset resolution.

#### [frontend/tailwind.config.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/tailwind.config.js)
- Tailwind configuration pointing to HTML and JS files in `frontend/` to purge unused styles.
- Define theme colors matching the mockup styling (e.g., `#1e40af` primary blue, and font settings).

#### [frontend/index.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/index.html)
- Main application shell containing:
  - Page head (fonts, icons, stylesheets).
  - Main navigation header and footer (adapted from mockups, dynamically adjusting links depending on auth state).
  - An `#app` mounting point where the router swaps page views.


### 2. Router & State Management

#### [NEW] [frontend/src/router.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/router.js)
- A lightweight Vanilla JS hash-based router (`#/`, `#/login`, `#/dashboard`, `#/items/new`, etc.).
- Guarded routes: redirect unauthenticated users away from private pages (dashboard, claims, profile, post-item) and redirect logged-in users away from auth pages (login, register).

#### [NEW] [frontend/src/state.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/state.js)
- Global store for reactive-like state (current user profile, auth status, active tokens).

---

### 3. API & Authentication Client

#### [NEW] [frontend/src/api.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/api.js)
- Core API client utilizing `fetch` with interceptor-like behavior:
  - Automatically appends `Authorization: Bearer <token>` header to protected requests.
  - Detects `401 Unauthorized` responses and attempts token refresh via `/api/auth/refresh/` using the stored refresh token.
  - If refresh fails, invalidates session and redirects user to `#/login`.

---

### 4. SPA Views & Page Loaders

We will adapt the mockups from the root `templates/` directory into dynamic JS modules in `frontend/src/views/` that render the markup and attach event listeners:

#### [NEW] [frontend/src/views/home.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/views/home.js)
- Renders the home landing page (adapted from [templates/index.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/index.html)) with stats.

#### [NEW] [frontend/src/views/login.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/views/login.js)
- Renders the login form (adapted from [templates/login-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/login-page.html)), handles submission, gets JWT, and redirects to dashboard.

#### [NEW] [frontend/src/views/register.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/views/register.js)
- Renders the registration form (adapted from [templates/register-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/register-page.html)) with .edu validations.

#### [NEW] [frontend/src/views/dashboard.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/views/user-dashboard-page.js)
- Renders user dashboard (adapted from [templates/user-dashboard-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/user-dashboard-page.html)). Fetches user profile, items, claims from the API.

#### [NEW] [frontend/src/views/items.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/views/items.js)
- Renders item listings, search, and post item forms (integrating [search-lost-item-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/search-lost-item-page.html), [post-lost-item-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/post-lost-item-page.html), [post-found-item-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/post-found-item-page.html), [item-details-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/item-details-page.html)).

#### [NEW] [frontend/src/views/chat.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/src/views/chat.js)
- Renders real-time chat dashboard (from [chat-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/chat-page.html)). Connects to WebSocket backend group.

---

### 5. Backend Configuration Adjustments

#### [MODIFY] [backend/config/settings.py](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/backend/config/settings.py)
- Ensure CORS settings support the Vite port (e.g. `http://localhost:5173` or port `3000`).

#### [MODIFY] [backend/.env](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/backend/.env)
- Update `CORS_ALLOWED_ORIGINS` to contain frontend Vite development server URLs.
