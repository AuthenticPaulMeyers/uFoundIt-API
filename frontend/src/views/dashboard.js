import { api } from '../api.js';
import { state, setAuthState } from '../state.js';

export default {
  async render(params, query) {
    return `
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
        <!-- Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden shrink-0 flex items-center justify-center">
              <img id="dash-avatar" src="${state.user?.profile_picture_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXuyMvuk0imR0E1bUgkh_20NE5HGS1Cw-uNCCYGRS0JucK9YimIGsiJXX-faZQiB3qgaReF7vuhQpvyoBPOostf6qEhrH9pS9rYQiYyinEVzjwBwyv5BNp7k5Mq5NqVG9fRU_xXfKrxuEx_LbHxovWk-2dEvcEXiDiuR_DP7yk7aN0bqaGsgCwQzbqtoLn4-99Ggpsg_vAs7fbjeAnBXn2dfGGuyookJ5yIpOMOr_tofvCPanw5OY8-d6uiJdXMOMtGGGWSSBg7QG9'}" alt="Profile Avatar" class="w-full h-full object-cover" />
            </div>
            <div>
              <h2 class="text-3xl font-bold text-slate-900 dark:text-white" id="dash-fullname">${state.user?.full_name || 'Campus Student'}</h2>
              <p class="text-slate-500 text-sm flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">alternate_email</span>
                @<span id="dash-username">${state.user?.user?.username || 'username'}</span>
                ${state.user?.is_verified ? '<span class="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5"><span class="material-symbols-outlined text-[10px]">verified</span>Verified</span>' : ''}
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <a href="#/items/new" class="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all text-sm">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              Post Item
            </a>
          </div>
        </div>

        <!-- Dashboard Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar tabs -->
          <div class="lg:col-span-1 flex flex-col gap-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 h-fit">
            <button data-tab="overview" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-primary bg-primary/5 text-left transition-all">
              <span class="material-symbols-outlined">analytics</span>
              Overview & Stats
            </button>
            <button data-tab="my-items" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
              <span class="material-symbols-outlined">inventory</span>
              My Postings
            </button>
            <button data-tab="received-claims" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
              <span class="material-symbols-outlined">assignment_returned</span>
              Received Claims
            </button>
            <button data-tab="submitted-claims" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
              <span class="material-symbols-outlined">assignment_turned_in</span>
              Submitted Claims
            </button>
            <button data-tab="settings" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
              <span class="material-symbols-outlined">settings</span>
              Edit Profile
            </button>
          </div>

          <!-- Main content area -->
          <div class="lg:col-span-3 flex flex-col gap-6" id="dashboard-tab-content">
            <!-- Loader initially -->
            <div class="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span class="material-symbols-outlined animate-spin text-5xl text-primary">sync</span>
              <p class="text-slate-500 text-sm mt-4 font-medium">Hydrating dashboard metrics...</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender(params, query) {
    const tabContent = document.getElementById('dashboard-tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    let currentTab = 'overview';
    let profileData = state.user;
    let myItems = [];
    let claimsData = [];

    // Helper to change active tab styling
    const switchTabBtn = (tabName) => {
      tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
          btn.classList.add('text-primary', 'bg-primary/5');
          btn.classList.remove('text-slate-500', 'dark:text-slate-400');
        } else {
          btn.classList.remove('text-primary', 'bg-primary/5');
          btn.classList.add('text-slate-500', 'dark:text-slate-400');
        }
      });
    };

    // Load necessary API data
    const loadDashboardData = async () => {
      try {
        const [profRes, itemsRes, claimsRes] = await Promise.all([
          api.get('/api/profiles/me/'),
          api.get('/api/items/'),
          api.get('/api/claims/'),
        ]);

        if (profRes.ok) {
          profileData = await profRes.json();
          setAuthState({ user: profileData });
          // Update avatar/header details if updated
          const avatarEl = document.getElementById('dash-avatar');
          if (avatarEl) avatarEl.src = profileData.profile_picture_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXuyMvuk0imR0E1bUgkh_20NE5HGS1Cw-uNCCYGRS0JucK9YimIGsiJXX-faZQiB3qgaReF7vuhQpvyoBPOostf6qEhrH9pS9rYQiYyinEVzjwBwyv5BNp7k5Mq5NqVG9fRU_xXfKrxuEx_LbHxovWk-2dEvcEXiDiuR_DP7yk7aN0bqaGsgCwQzbqtoLn4-99Ggpsg_vAs7fbjeAnBXn2dfGGuyookJ5yIpOMOr_tofvCPanw5OY8-d6uiJdXMOMtGGGWSSBg7QG9';
          const nameEl = document.getElementById('dash-fullname');
          if (nameEl) nameEl.innerText = profileData.full_name || 'Campus Student';
        }

        if (itemsRes.ok) {
          const allItems = await itemsRes.json();
          // Filter to own items (by owner profile id)
          myItems = allItems.results ? allItems.results.filter(item => item.owner && item.owner.id === profileData.id) : [];
        }

        if (claimsRes.ok) {
          claimsData = await claimsRes.json();
        }
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      }
    };

    const renderTab = () => {
      switchTabBtn(currentTab);

      if (currentTab === 'overview') {
        renderOverview();
      } else if (currentTab === 'my-items') {
        renderMyItems();
      } else if (currentTab === 'received-claims') {
        renderReceivedClaims();
      } else if (currentTab === 'submitted-claims') {
        renderSubmittedClaims();
      } else if (currentTab === 'settings') {
        renderSettings();
      }
    };

    // TAB 1: OVERVIEW
    const renderOverview = () => {
      tabContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Reputation</span>
            <div class="flex items-end gap-2">
              <span class="text-3xl font-extrabold text-primary">${profileData.reputation_score}</span>
              <span class="text-sm font-semibold text-slate-500 mb-1">/ 100</span>
            </div>
            <span class="text-xs text-slate-500 font-medium">Level: <strong class="text-primary">${profileData.reputation_level}</strong></span>
          </div>

          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifications</span>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-extrabold text-slate-800 dark:text-white">
                ${profileData.verification_status?.email_verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <span class="text-xs text-slate-500 font-medium">Domain: ${profileData.verification_status?.university_domain || 'none'}</span>
          </div>

          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Success</span>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-extrabold text-green-600">${profileData.total_successful_claims}</span>
            </div>
            <span class="text-xs text-slate-500 font-medium">Reunions completed</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 class="text-lg font-bold mb-4 dark:text-white">Activity Overview</h3>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
              <span class="text-sm text-slate-600 dark:text-slate-300">Items Found</span>
              <span class="text-sm font-bold">${profileData.total_items_found}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
              <span class="text-sm text-slate-600 dark:text-slate-300">Items Lost</span>
              <span class="text-sm font-bold">${profileData.total_items_lost}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm text-slate-600 dark:text-slate-300">Default Proximity Location</span>
              <span class="text-sm font-bold text-primary">${profileData.campus_location || 'Not set'}</span>
            </div>
          </div>
        </div>
      `;
    };

    // TAB 2: MY ITEMS
    const renderMyItems = () => {
      if (myItems.length === 0) {
        tabContent.innerHTML = `
          <div class="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center gap-4">
            <span class="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
            <h4 class="text-lg font-bold dark:text-white">No posted items yet</h4>
            <p class="text-slate-500 text-sm max-w-sm">Have you lost or found something? List it now to notify the campus.</p>
            <a href="#/items/new" class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm">Post New Item</a>
          </div>
        `;
        return;
      }

      let itemsHtml = myItems.map(item => `
        <div class="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:shadow-sm transition-all cursor-pointer" onclick="window.location.hash='#/items/${item.id}'">
          <div class="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            ${item.images && item.images.length > 0 ? `<img src="${item.images[0].image}" class="w-full h-full object-cover"/>` : '<span class="material-symbols-outlined text-slate-400 text-3xl">image</span>'}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-slate-800 dark:text-white truncate">${item.title}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.item_type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}">${item.item_type}</span>
              <span class="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">${item.status}</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
      `).join('');

      tabContent.innerHTML = `
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-bold dark:text-white">My Postings (${myItems.length})</h3>
          <div class="flex flex-col gap-3">${itemsHtml}</div>
        </div>
      `;
    };

    // TAB 3: RECEIVED CLAIMS
    const renderReceivedClaims = () => {
      // Received claims: claims made on items POSTED by current user
      const received = claimsData.filter(c => c.item_details && c.item_details.owner && c.item_details.owner.id === profileData.id);

      if (received.length === 0) {
        tabContent.innerHTML = `
          <div class="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center gap-4">
            <span class="material-symbols-outlined text-6xl text-slate-300">assignment_returned</span>
            <h4 class="text-lg font-bold dark:text-white">No received claims</h4>
            <p class="text-slate-500 text-sm max-w-sm">When other students claim items you reported found, they will appear here for approval.</p>
          </div>
        `;
        return;
      }

      let claimsHtml = received.map(claim => `
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Claim on item:</span>
              <a href="#/items/${claim.item_details.id}" class="text-primary font-bold hover:underline block text-base">${claim.item_details.title}</a>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${claim.status === 'approved' ? 'bg-green-50 text-green-600' : claim.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}">
              ${claim.status}
            </span>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500">Claimer:</span>
              <span class="text-xs font-semibold text-slate-800 dark:text-white">${claim.claimer?.full_name} (@${claim.claimer?.user?.username})</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">Rep: ${claim.claimer?.reputation_score}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 italic">" ${claim.verification_description} "</p>
          </div>

          ${claim.status === 'pending' ? `
            <div class="flex gap-2">
              <button data-claim-id="${claim.id}" data-action="approve" class="claim-act-btn flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors">
                Approve & Connect
              </button>
              <button data-claim-id="${claim.id}" data-action="reject" class="claim-act-btn flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors">
                Reject
              </button>
            </div>
          ` : ''}

          ${claim.status === 'approved' ? `
            <div class="flex gap-2">
              <button data-claim-id="${claim.id}" data-action="resolve" class="claim-act-btn flex-1 py-2 bg-primary text-white hover:bg-primary/95 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm">handshake</span> Mark Resolved / Returned
              </button>
            </div>
          ` : ''}
        </div>
      `).join('');

      tabContent.innerHTML = `
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-bold dark:text-white">Claims Received (${received.length})</h3>
          <div class="flex flex-col gap-4" id="claims-action-container">${claimsHtml}</div>
        </div>
      `;

      // Wire approval / rejection / resolution event listeners
      document.querySelectorAll('.claim-act-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const claimId = btn.dataset.claimId;
          const action = btn.dataset.action;
          
          btn.disabled = true;
          btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-xs">sync</span> Processing...`;

          try {
            const response = await api.post(`/api/claims/${claimId}/${action}/`);
            if (response.ok) {
              await loadDashboardData();
              renderReceivedClaims();
            } else {
              const err = await response.json();
              alert(`Action failed: ${JSON.stringify(err)}`);
              btn.disabled = false;
              btn.innerText = action.toUpperCase();
            }
          } catch (error) {
            console.error('Claim action error:', error);
            btn.disabled = false;
          }
        });
      });
    };

    // TAB 4: SUBMITTED CLAIMS
    const renderSubmittedClaims = () => {
      // Claims made BY current user
      const submitted = claimsData.filter(c => c.claimer && c.claimer.id === profileData.id);

      if (submitted.length === 0) {
        tabContent.innerHTML = `
          <div class="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center gap-4">
            <span class="material-symbols-outlined text-6xl text-slate-300">assignment_turned_in</span>
            <h4 class="text-lg font-bold dark:text-white">No submitted claims</h4>
            <p class="text-slate-500 text-sm max-w-sm">When you search for items and submit claims to prove ownership, they will be listed here.</p>
            <a href="#/items" class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm">Browse Items</a>
          </div>
        `;
        return;
      }

      let claimsHtml = submitted.map(claim => `
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
          <div class="flex justify-between items-start gap-4">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted claim on item:</span>
              <a href="#/items/${claim.item_details?.id}" class="text-primary font-bold hover:underline block text-base">${claim.item_details?.title || 'Unknown Item'}</a>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${claim.status === 'approved' ? 'bg-green-50 text-green-600' : claim.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}">
              ${claim.status}
            </span>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-1">Your description:</span>
            <p class="text-xs text-slate-600 dark:text-slate-300 italic">" ${claim.verification_description} "</p>
          </div>

          ${claim.status === 'approved' ? `
            <div class="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs flex items-center gap-2">
              <span class="material-symbols-outlined">chat_bubble</span>
              <span>Your claim was approved! Go to <a href="#/chat" class="font-bold underline text-primary">Messages</a> to arrange a handoff.</span>
            </div>
          ` : ''}
        </div>
      `).join('');

      tabContent.innerHTML = `
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-bold dark:text-white">Claims Submitted (${submitted.length})</h3>
          <div class="flex flex-col gap-4">${claimsHtml}</div>
        </div>
      `;
    };

    // TAB 5: SETTINGS
    const renderSettings = () => {
      tabContent.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-6">
          <h3 class="text-lg font-bold dark:text-white">Edit Profile Details</h3>
          
          <div id="settings-alert" class="hidden p-4 rounded-xl text-sm flex items-center gap-2">
            <span class="material-symbols-outlined" id="settings-alert-icon">info</span>
            <span id="settings-alert-msg"></span>
          </div>

          <form id="form-update-profile" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="prof-name" class="text-xs font-bold text-slate-600">Full Name</label>
              <input type="text" id="prof-name" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" value="${profileData.full_name || ''}" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="prof-phone" class="text-xs font-bold text-slate-600">Phone Number</label>
              <input type="text" id="prof-phone" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" value="${profileData.phone_number || ''}" placeholder="e.g. +1 555-0199" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="prof-loc" class="text-xs font-bold text-slate-600">Primary Campus Location</label>
              <input type="text" id="prof-loc" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" value="${profileData.campus_location || ''}" placeholder="e.g. Main Library, Student Union" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="prof-bio" class="text-xs font-bold text-slate-600">Bio</label>
              <textarea id="prof-bio" class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm h-24" placeholder="Brief description about yourself...">${profileData.bio || ''}</textarea>
            </div>

            <button type="submit" id="btn-update-prof" class="w-fit px-8 h-11 bg-primary text-white font-bold text-xs rounded-xl shadow hover:bg-primary/95 transition-all">
              Save Profile Settings
            </button>
          </form>

          <hr class="border-slate-100 dark:border-slate-800" />

          <!-- Avatar upload -->
          <h3 class="text-sm font-bold dark:text-white uppercase tracking-wider text-slate-400">Update Profile Avatar</h3>
          <form id="form-upload-avatar" class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0">
              <img id="avatar-preview" src="${profileData.profile_picture_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXuyMvuk0imR0E1bUgkh_20NE5HGS1Cw-uNCCYGRS0JucK9YimIGsiJXX-faZQiB3qgaReF7vuhQpvyoBPOostf6qEhrH9pS9rYQiYyinEVzjwBwyv5BNp7k5Mq5NqVG9fRU_xXfKrxuEx_LbHxovWk-2dEvcEXiDiuR_DP7yk7aN0bqaGsgCwQzbqtoLn4-99Ggpsg_vAs7fbjeAnBXn2dfGGuyookJ5yIpOMOr_tofvCPanw5OY8-d6uiJdXMOMtGGGWSSBg7QG9'}" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col gap-2">
              <input type="file" id="file-avatar" accept="image/*" class="text-xs" />
              <button type="submit" id="btn-upload-avatar" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors">
                Upload New Image
              </button>
            </div>
          </form>

          <hr class="border-slate-100 dark:border-slate-800" />

          <!-- Change password -->
          <h3 class="text-sm font-bold dark:text-white uppercase tracking-wider text-slate-400">Change Password</h3>
          <form id="form-change-password" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="old-pass" class="text-xs font-bold text-slate-600">Old Password</label>
              <input type="password" id="old-pass" required class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" placeholder="••••••••" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="new-pass" class="text-xs font-bold text-slate-600">New Password</label>
              <input type="password" id="new-pass" required class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" placeholder="••••••••" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="new-pass2" class="text-xs font-bold text-slate-600">Confirm New Password</label>
              <input type="password" id="new-pass2" required class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" placeholder="••••••••" />
            </div>

            <button type="submit" id="btn-change-pass" class="w-fit px-8 h-10 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all">
              Change Account Password
            </button>
          </form>
        </div>
      `;

      const alertEl = document.getElementById('settings-alert');
      const alertMsg = document.getElementById('settings-alert-msg');
      const alertIcon = document.getElementById('settings-alert-icon');

      const showAlert = (message, isSuccess = true) => {
        alertEl.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'border-green-500', 'bg-red-50', 'text-red-700', 'border-red-500');
        if (isSuccess) {
          alertEl.classList.add('bg-green-50', 'text-green-700', 'border-l-4', 'border-green-500');
          alertIcon.innerText = 'check_circle';
        } else {
          alertEl.classList.add('bg-red-50', 'text-red-700', 'border-l-4', 'border-red-500');
          alertIcon.innerText = 'error';
        }
        alertMsg.innerText = message;
      };

      // Handle profile update
      document.getElementById('form-update-profile')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-update-prof');
        submitBtn.disabled = true;

        const data = {
          full_name: document.getElementById('prof-name').value.trim(),
          phone_number: document.getElementById('prof-phone').value.trim(),
          campus_location: document.getElementById('prof-loc').value.trim(),
          bio: document.getElementById('prof-bio').value.trim(),
        };

        try {
          const res = await api.patch('/api/profiles/update_profile/', data);
          if (res.ok) {
            showAlert('Profile settings saved successfully.');
            await loadDashboardData();
          } else {
            const errs = await res.json();
            showAlert(JSON.stringify(errs), false);
          }
        } catch (error) {
          console.error(error);
          showAlert('Failed to connect to server.', false);
        } finally {
          submitBtn.disabled = false;
        }
      });

      // Handle avatar upload
      document.getElementById('form-upload-avatar')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file-avatar');
        if (fileInput.files.length === 0) return;

        const submitBtn = document.getElementById('btn-upload-avatar');
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append('profile_picture', fileInput.files[0]);

        try {
          const res = await api.patch('/api/profiles/upload_avatar/', formData);
          if (res.ok) {
            showAlert('Avatar picture updated.');
            await loadDashboardData();
            // Show preview
            document.getElementById('avatar-preview').src = profileData.profile_picture_url;
            const headerAvatar = document.querySelector('#nav-actions img');
            if (headerAvatar) headerAvatar.src = profileData.profile_picture_url;
          } else {
            const err = await res.json();
            showAlert(`Avatar failed: ${JSON.stringify(err)}`, false);
          }
        } catch (error) {
          console.error(error);
          showAlert('Failed to upload avatar.', false);
        } finally {
          submitBtn.disabled = false;
        }
      });

      // Handle change password
      document.getElementById('form-change-password')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('old-pass').value;
        const newPass = document.getElementById('new-pass').value;
        const newPass2 = document.getElementById('new-pass2').value;

        if (newPass !== newPass2) {
          showAlert('New passwords do not match.', false);
          return;
        }

        const submitBtn = document.getElementById('btn-change-pass');
        submitBtn.disabled = true;

        try {
          const res = await api.post('/api/profiles/change_password/', {
            old_password: oldPass,
            new_password: newPass,
            new_password2: newPass2,
          });

          if (res.ok) {
            showAlert('Password changed successfully.');
            document.getElementById('form-change-password').reset();
          } else {
            const errs = await res.json();
            showAlert(errs.old_password || errs.new_password || 'Password change failed.', false);
          }
        } catch (error) {
          console.error(error);
          showAlert('Server error.', false);
        } finally {
          submitBtn.disabled = false;
        }
      });
    };

    // Initialize View Data
    await loadDashboardData();
    renderTab();

    // Setup sidebar navigation links
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        renderTab();
      });
    });
  }
};
