import { setAuthState } from '../state.js';
import { api } from '../api.js';

export default {
  async render(params, query) {
    return `
      <div class="max-w-md mx-auto my-12 md:my-20 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl animate-fade-in">
        <div class="flex flex-col items-center gap-4 mb-8">
          <div class="size-12 bg-primary rounded-xl flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-3xl">search_check</span>
          </div>
          <h2 class="text-2xl font-bold dark:text-white">Welcome Back</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Please log in to manage your lost & found items</p>
        </div>

        <div id="login-error" class="hidden mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 text-sm flex items-center gap-2">
          <span class="material-symbols-outlined">error</span>
          <span id="error-message">Invalid credentials</span>
        </div>

        <form id="form-login" class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label for="username" class="text-sm font-semibold text-slate-700 dark:text-slate-300">Username or Email</label>
            <input type="text" id="username" required class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="username or email"/>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label for="password" class="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            </div>
            <input type="password" id="password" required class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="••••••••"/>
          </div>

          <button type="submit" id="btn-login-submit" class="w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex gap-2">
            <span>Log In</span>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm">
          <p class="text-slate-500">Don't have an account? <a href="#/register" class="text-primary font-bold hover:underline">Sign Up</a></p>
        </div>
      </div>
    `;
  },

  async afterRender(params, query) {
    const form = document.getElementById('form-login');
    const submitBtn = document.getElementById('btn-login-submit');
    const errorBox = document.getElementById('login-error');
    const errorMessage = document.getElementById('error-message');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      errorBox.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Logging in...`;

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const response = await api.post('/api/auth/login/', { username, password });
        
        if (response.ok) {
          const data = await response.json();
          // Save credentials and update state
          setAuthState({
            accessToken: data.access,
            refreshToken: data.refresh,
            user: data.user,
          });

          // Fetch fresh user profile details
          try {
            const profileResponse = await api.get('/api/profiles/me/');
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setAuthState({ user: profileData });
            }
          } catch (e) {
            console.error('Failed to get user profile details:', e);
          }

          // Redirect to target redirect route or dashboard
          const redirect = query.redirect || 'dashboard';
          const typeParam = query.type ? `?type=${query.type}` : '';
          window.location.hash = `#/${redirect}${typeParam}`;
        } else {
          const errorData = await response.json().catch(() => ({}));
          errorMessage.innerText = errorData.detail || 'Invalid username or password';
          errorBox.classList.remove('hidden');
        }
      } catch (err) {
        console.error('Login error:', err);
        errorMessage.innerText = 'Unable to connect to server. Please try again.';
        errorBox.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Log In</span>`;
      }
    });
  }
};
