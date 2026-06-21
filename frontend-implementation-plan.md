# uFoundIt SPA Frontend Implementation Plan (Vite + Vanilla JS)

This document outlines the design, architecture, and step-by-step phase-by-phase implementation plan for building the single-page application (SPA) frontend for the uFoundIt Campus Lost & Found platform. The frontend will be built using Vite and Vanilla JavaScript, remaining strictly decoupled from the Django REST Framework backend.

Follow the consistency in design decision as proposed by the UI templates. Remove any unnecessary features included in the templates that will not be needed in this design. 

Colours, fonts, spaces, boxes, should be consistent throughout the design.
---

## User Review Required

> [!IMPORTANT]
> - **CORS & Proxying**: The Django backend is currently configured to accept local requests from `http://localhost:3000` and `http://localhost:8000`. By default, Vite runs on `http://localhost:5173`. We will configure Vite to run on port `3000` or adjust the Django `CORS_ALLOWED_ORIGINS` in `backend/.env` to include port `5173`. We will also use a Vite dev server proxy for `/api/` paths so that AJAX requests appear same-origin during development.
> - **Multi-page HTMLs to SPA Transition**: The mockups in `templates/` represent distinct pages (e.g. `index.html`, `login-page.html`, `user-dashboard-page.html`). We will transition this structure to a dynamic SPA by creating component templates (or dynamic page loaders) in Vanilla JS that swap the main section contents of a single entry page, sharing a common navigation header/footer.

---

## Open Questions

> [!NOTE]
> - **JWT Persistence**: Store JWT tokens in `localStorage` for persistent login sessions across browser restarts.
> - **Vite Development Port**: Run the Vite development server on port `3000` to align with the pre-configured backend CORS defaults.

---

## Proposed Changes

We will introduce a new frontend directory and make minor configuration updates to the backend to support CORS and asset management.

### 1. Frontend SPA Initialization

#### [NEW] [frontend/package.json](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/package.json)
- Create Vite vanilla JS app with script dependencies: Tailwind CSS, PostCSS, Autoprefixer.

#### [NEW] [frontend/vite.config.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/vite.config.js)
- Configure Vite development server:
  - Add proxy settings for `/api/` pointing to `http://localhost:8000/api/` to avoid CORS issues during development.
  - Set up build/asset resolution.

#### [NEW] [frontend/tailwind.config.js](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/tailwind.config.js)
- Tailwind configuration pointing to HTML and JS files in `frontend/` to purge unused styles.
- Define theme colors matching the mockup styling (e.g., `#1e40af` primary blue, and font settings).

#### [NEW] [frontend/index.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/frontend/index.html)
- Main application shell containing:
  - Page head (fonts, icons, stylesheets).
  - Main navigation header and footer (adapted from mockups, dynamically adjusting links depending on auth state).
  - An `#app` mounting point where the router swaps page views.

---

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

---

## Detailed Phase-by-Phase Implementation Plan

### Phase 1: Environment Setup & Project Initialization
1. **Initialize Vite Application**:
   Create the directory `frontend` and run the non-interactive initialization command:
   ```bash
   npx -y create-vite@latest frontend --template vanilla --no-interactive
   ```
2. **Install Tailwind CSS & Dev Tools**:
   Install Tailwind CSS, PostCSS, and Autoprefixer inside the `frontend/` directory:
   ```bash
   cd frontend
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. **Configure Tailwind Content Parsing**:
   Configure `frontend/tailwind.config.js` to scan files in both `index.html` and the `src` directory:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```
4. **Vite Server Proxy Setup**:
   Add proxy config to `frontend/vite.config.js` so that requests to `/api/` are forwarded to the Django backend (`http://localhost:8000/api/`).
5. **Backend CORS Setup**:
   Modify `backend/config/settings.py` and `backend/.env` to include Vite's local URLs (`http://localhost:5173` or `http://localhost:3000`).

> [!WARNING]
> **Risk - Tailwind Purging Dynamic HTML Styles**: Since pages are injected as template strings in JS, Tailwind might purge classes that are constructed dynamically (e.g. `bg-${color}-100`).
> **Correction**: Keep class names fully written out in code (e.g., write the complete classes `bg-red-100` and `bg-green-100` instead of dynamic string concatenation).

---

### Phase 2: Core Shell, Router & State Management
1. **Create App Entry Point**:
   Set up `frontend/index.html` with basic layout structure containing a persistent header, a main mounting container `<main id="app"></main>`, and a footer.
2. **Build Client Router**:
   Implement a hash-based router (`frontend/src/router.js`) using `window.addEventListener('hashchange')` and `window.addEventListener('load')`.
3. **Implement Store State**:
   Define `frontend/src/state.js` to hold user profile information, authentication status, and active token strings.
4. **Route Protection**:
   Implement navigation guards in the router:
   - Private routes (e.g. `#/dashboard`, `#/claims`, `#/items/new`) redirect to `#/login` if state is unauthenticated.
   - Guest routes (e.g. `#/login`, `#/register`) redirect to `#/dashboard` if already authenticated.

> [!WARNING]
> **Risk - Session Loss on Refresh**: Refreshing the browser page resets the JavaScript memory space, clearing the user's active session.
> **Correction**: Persist JWT access and refresh tokens to `localStorage`. On application boot, load the tokens, decode the access token to check validity, and hydrate `state.js` before performing the first route navigation.

---

### Phase 3: Authentication and User Registration UI
1. **API Client Setup**:
   Write `frontend/src/api.js` to wrap `fetch` calls. Include helper methods `api.get()`, `api.post()`, `api.patch()`, and `api.delete()`.
2. **Setup Interceptors**:
   - Write request interceptor logic to inject the `Authorization: Bearer <token>` header if a token is present in the state.
   - Write response interceptor logic to catch `401 Unauthorized` responses. If a request fails with 401, pause other requests, call POST `/api/auth/refresh/` with the stored refresh token to get a new access token, update the state/local storage, and retry the failed requests. If the refresh token is invalid or expired, log out the user and redirect to `#/login`.
3. **Registration View (`#/register`)**:
   Implement `frontend/src/views/register.js` mapping fields from [register-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/register-page.html) to `/api/auth/register/`. Include validators for matching passwords and enforcing `.edu` email requirements.
4. **Login View (`#/login`)**:
   Implement `frontend/src/views/login.js` mapping fields from [login-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/login-page.html) to POST `/api/auth/login/`. Stores tokens and redirects to dashboard.

> [!CAUTION]
> **Risk - JWT Refresh Request Flood**: If a page has multiple concurrent API requests (e.g., loading items, categories, and notifications at once) and the access token has expired, all of them will fail with `401` simultaneously. This can trigger multiple overlapping calls to the `/api/auth/refresh/` endpoint, causing the backend (which blacklists old refresh tokens on rotation) to fail.
> **Correction**: Implement a `isRefreshing` lock flag and a waiting queue in `api.js`. Only the first 401 triggers the refresh call. Subsequent 401s are added to a queue of promises that resolve once the token refresh completes.

---

### Phase 4: User Dashboard & Profile Management
1. **Dashboard View (`#/dashboard`)**:
   Implement `frontend/src/views/dashboard.js` using the markup from [user-dashboard-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/user-dashboard-page.html). Call `/api/profiles/me/` and render user's reputation, verification level, and item stats.
2. **Profile View (`#/profile/:id`)**:
   Implement `frontend/src/views/profile.js` based on [user-profile-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/user-profile-page.html).
3. **Settings / Edit Profile View (`#/settings`)**:
   Implement edit profile (from [edit-profile-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/edit-profile-page.html)). Handlers for updating names/bios (PATCH `/api/profiles/update_profile/`) and uploading avatars (PATCH `/api/profiles/upload_avatar/`).

> [!WARNING]
> **Risk - Avatar File Uploads**: Sending file payloads as standard JSON triggers a server-side parsing error.
> **Correction**: For image/avatar upload requests, use `FormData` instead of JSON string payloads, and ensure the `Content-Type` header is **not** set manually in `fetch()` so the browser can calculate the correct boundary string.

---

### Phase 5: Item Postings & Matching Search
1. **Browse Items / Search (`#/items`)**:
   Port [search-lost-item-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/search-lost-item-page.html). Populate with a list of items retrieved from GET `/api/items/`. Build filter components for lost vs. found items, item categories, status, and search query inputs, executing requests dynamically.
2. **Item Details View (`#/items/:id`)**:
   Port [item-details-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/item-details-page.html) to render full item specifications, photo carousels, and location markers.
3. **Post Item View (`#/items/new`)**:
   Port [post-lost-item-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/post-lost-item-page.html) and [post-found-item-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/post-found-item-page.html) into forms pointing to POST `/api/items/`. Support category selection and image file uploads.

> [!NOTE]
> **Risk - Category IDs Mismatch**: Front-end category selections might get hardcoded, breaking if database category UUIDs change.
> **Correction**: Fetch categories dynamically from `/api/categories/` on page load, rendering selection menus dynamically using database primary keys.

---

### Phase 6: Claims Management Workflow UI
1. **Submit Claim Modal/Form**:
   Within the Item Details view, render a claim modal asking the user to answer the verification question and write a description. Call POST `/api/claims/`.
2. **Manage My Claims (`#/manage-claims`)**:
   Port [manage-items-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/manage-items-page.html) to show items posted by the user alongside all claims made on them, as well as claims the user has submitted.
3. **Status Transitions Buttons**:
   Wire buttons for claim approval/rejection/resolution:
   - Approve: POST `/api/claims/{id}/approve/`
   - Reject: POST `/api/claims/{id}/reject/`
   - Resolve: POST `/api/claims/{id}/resolve/`
   - Cancel: POST `/api/claims/{id}/cancel/`

> [!WARNING]
> **Risk - Duplicate Claims (Db Integrity Error)**: A user double-clicking "Submit Claim" could trigger two requests, crashing the application with a database integrity error.
> **Correction**: Disable the "Submit" button instantly upon click to prevent double-submitting, and catch API 400 responses to show a friendly *"You have already claimed this item"* message.

---

### Phase 7: Real-Time Chat & WS Integration
1. **Chat UI (`#/chat`)**:
   Port [chat-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/chat-page.html) to display active conversations.
2. **WebSocket Client**:
   Define `frontend/src/chatWs.js` to manage WebSocket connections using `window.WebSocket`.
   - Formulate WS connection path: `ws://localhost:8000/ws/chat/{conversation_id}/?token=ACCESS_TOKEN`.
3. **Real-time Message rendering**:
   Append received messages to the message list DOM dynamically, and push sent messages through the WebSocket connection.

> [!IMPORTANT]
> **Risk - WebSocket Auth Limitation**: WebSockets in browsers do not support custom authorization headers.
> **Correction**: Pass the JWT access token in the WebSocket URL query string, and write a custom Django ASGI Middleware on the backend to parse the query string, extract the token, and authenticate the user context.

---

### Phase 8: Notifications & Launch Preparation
1. **Global Notification Hook**:
   Establish a permanent background WebSocket connection to the notification group `ws://localhost:8000/ws/notifications/?token=ACCESS_TOKEN` on app boot.
2. **Notification UI (`#/notifications`)**:
   Port [notification-page.html](file:///c:/Users/meyers/Desktop/projects/uFoundIt-API/templates/notification-page.html) to render alerts, and trigger interactive browser toast banners on incoming messages/updates.
3. **Production Bundling**:
   Configure production build scripts in package.json:
   ```json
   "build": "vite build"
   ```
4. **Deploy Assets**:
   Optimize build output for caching, preparing files to be served via Nginx or static file CDNs.

---

## Verification Plan

### Automated Tests
- Run `pytest` on backend to ensure all existing test suites still pass:
  `cd backend; pytest`

