import { api } from '../api.js';

export default {
  async render() {
    return `
      <div class="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl animate-fade-in">
        <div class="flex flex-col items-center gap-4 mb-8">
          <div class="size-12 bg-primary rounded-xl flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-3xl">search_check</span>
          </div>
          <h2 class="text-2xl font-bold dark:text-white">Create Account</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Join uFoundIt campus network today</p>
        </div>

        <div id="register-error" class="hidden mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 text-sm flex items-center gap-2">
          <span class="material-symbols-outlined">error</span>
          <span id="error-message">Failed to create account</span>
        </div>

        <div id="register-success" class="hidden mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r text-green-700 text-sm flex items-center gap-2">
          <span class="material-symbols-outlined">check_circle</span>
          <span>Account created successfully! Redirecting to login...</span>
        </div>

        <form id="form-register" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="fullname" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input type="text" id="fullname" required class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="John Doe"/>
          </div>

          <div class="flex flex-col gap-1">
            <label for="reg-email" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Account Email</label>
            <input type="email" id="reg-email" required class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="john@example.com"/>
          </div>

          <div class="flex flex-col gap-1">
            <label for="reg-username" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Username (optional)</label>
            <input type="text" id="reg-username" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="johndoe"/>
          </div>

          <div class="flex flex-col gap-1">
            <label for="uni-email" class="text-xs font-semibold text-slate-700 dark:text-slate-300">University Email (required for verification)</label>
            <input type="email" id="uni-email" required class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="johndoe@university.edu"/>
            <span id="uni-email-warning" class="hidden text-red-500 text-[11px]">Must end with .edu</span>
          </div>

          <div class="flex flex-col gap-1">
            <label for="campus-loc" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Campus Location (optional)</label>
            <input type="text" id="campus-loc" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="e.g., Main Library"/>
          </div>

          <div class="flex flex-col gap-1">
            <label for="reg-password" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" id="reg-password" required class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="••••••••"/>
          </div>

          <div class="flex flex-col gap-1">
            <label for="reg-password-confirm" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
            <input type="password" id="reg-password-confirm" required class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="••••••••"/>
            <span id="pass-match-warning" class="hidden text-red-500 text-[11px]">Passwords do not match</span>
          </div>

          <button type="submit" id="btn-register-submit" class="w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex gap-2 mt-2">
            <span>Sign Up</span>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm">
          <p class="text-slate-500">Already have an account? <a href="#/login" class="text-primary font-bold hover:underline">Log In</a></p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById('form-register');
    const submitBtn = document.getElementById('btn-register-submit');
    const errorBox = document.getElementById('register-error');
    const errorMessage = document.getElementById('error-message');
    const successBox = document.getElementById('register-success');

    const uniEmailInput = document.getElementById('uni-email');
    const uniEmailWarning = document.getElementById('uni-email-warning');
    const passInput = document.getElementById('reg-password');
    const passConfirmInput = document.getElementById('reg-password-confirm');
    const passWarning = document.getElementById('pass-match-warning');

    // Live validation for .edu email
    uniEmailInput?.addEventListener('input', () => {
      const value = uniEmailInput.value.trim().toLowerCase();
      if (value && !value.endsWith('.edu')) {
        uniEmailWarning.classList.remove('hidden');
      } else {
        uniEmailWarning.classList.add('hidden');
      }
    });

    // Live validation for matching passwords
    passConfirmInput?.addEventListener('input', () => {
      if (passInput.value !== passConfirmInput.value) {
        passWarning.classList.remove('hidden');
      } else {
        passWarning.classList.add('hidden');
      }
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      errorBox.classList.add('hidden');
      successBox.classList.add('hidden');

      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const username = document.getElementById('reg-username').value.trim();
      const uniEmail = uniEmailInput.value.trim();
      const campusLoc = document.getElementById('campus-loc').value.trim();
      const password = passInput.value;
      const passwordConfirm = passConfirmInput.value;

      // Final checks
      if (!uniEmail.toLowerCase().endsWith('.edu')) {
        errorMessage.innerText = 'University email must end with .edu';
        errorBox.classList.remove('hidden');
        return;
      }

      if (password !== passwordConfirm) {
        errorMessage.innerText = 'Passwords do not match';
        errorBox.classList.remove('hidden');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Creating account...`;

      const payload = {
        full_name: fullname,
        email: email,
        username: username || undefined,
        password: password,
        password2: passwordConfirm,
        university_email: uniEmail,
        campus_location: campusLoc || undefined,
      };

      try {
        const response = await api.post('/api/auth/register/', payload);
        
        if (response.ok) {
          successBox.classList.remove('hidden');
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 2000);
        } else {
          const errData = await response.json();
          // Extract specific error messages
          let msg = 'Registration failed. Please check inputs.';
          if (errData.password) {
            msg = `Password: ${errData.password.join(' ')}`;
          } else if (errData.email) {
            msg = `Email: ${errData.email.join(' ')}`;
          } else if (errData.university_email) {
            msg = `University Email: ${errData.university_email.join(' ')}`;
          } else if (errData.username) {
            msg = `Username: ${errData.username.join(' ')}`;
          } else if (errData.non_field_errors) {
            msg = errData.non_field_errors.join(' ');
          }
          errorMessage.innerText = msg;
          errorBox.classList.remove('hidden');
        }
      } catch (err) {
        console.error('Registration error:', err);
        errorMessage.innerText = 'Unable to connect to server. Please try again.';
        errorBox.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign Up</span>`;
      }
    });
  }
};
