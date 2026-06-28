import { api } from '../api.js';
import { state, setAuthState } from '../state.js';

export default {
  async render(params, query) {
    const targetId = params && params.id;
    const isOwnProfile = !targetId || targetId === state.user?.id;

    const sidebarHtml = isOwnProfile ? `
      <button data-tab="profile" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">account_circle</span>
        User Profile
      </button>
      <button data-tab="overview" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">analytics</span>
        Overview & Stats
      </button>
      <a href="#/items" class="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">search</span>
        Browse Items
      </a>
      <a href="#/chat" class="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">chat</span>
        Messages
      </a>
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
    ` : `
      <button data-tab="profile" class="tab-btn flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">account_circle</span>
        User Profile
      </button>
      <a href="#/items" class="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">search</span>
        Browse Items
      </a>
      <a href="#/chat" class="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
        <span class="material-symbols-outlined">chat</span>
        Messages
      </a>
    `;

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
              <div class="flex flex-col gap-0.5 mt-0.5">
                <p class="text-slate-500 text-sm flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">alternate_email</span>
                  @<span id="dash-username">${state.user?.user?.username || 'username'}</span>
                </p>
                <div class="flex items-center gap-1 mt-0.5" id="dash-verification-status">
                  ${state.user?.is_verified ? 
                    `<span class="text-green-600 dark:text-green-400 flex items-center gap-1 text-xs font-semibold"><span class="material-symbols-outlined text-sm">check_circle</span>Verified Student</span>` : 
                    `<span class="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-xs font-semibold"><span class="material-symbols-outlined text-sm">cancel</span>Unverified Account</span>`
                  }
                </div>
              </div>
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
            ${sidebarHtml}
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
    
    const targetId = params && params.id;
    const isOwnProfile = !targetId || targetId === state.user?.id;
    let currentTab = isOwnProfile ? 'overview' : 'profile';
    
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
          isOwnProfile ? api.get('/api/profiles/me/') : api.get(`/api/profiles/${targetId}/`),
          api.get('/api/items/'),
          isOwnProfile ? api.get('/api/claims/') : Promise.resolve({ ok: true, json: () => ({ results: [] }) }),
        ]);

        if (profRes.ok) {
          profileData = await profRes.json();
          if (isOwnProfile) {
            setAuthState({ user: profileData });
          }
          
          // Update header elements dynamically
          const avatarEl = document.getElementById('dash-avatar');
          if (avatarEl) avatarEl.src = profileData.profile_picture_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXuyMvuk0imR0E1bUgkh_20NE5HGS1Cw-uNCCYGRS0JucK9YimIGsiJXX-faZQiB3qgaReF7vuhQpvyoBPOostf6qEhrH9pS9rYQiYyinEVzjwBwyv5BNp7k5Mq5NqVG9fRU_xXfKrxuEx_LbHxovWk-2dEvcEXiDiuR_DP7yk7aN0bqaGsgCwQzbqtoLn4-99Ggpsg_vAs7fbjeAnBXn2dfGGuyookJ5yIpOMOr_tofvCPanw5OY8-d6uiJdXMOMtGGGWSSBg7QG9';
          const nameEl = document.getElementById('dash-fullname');
          if (nameEl) nameEl.innerText = profileData.full_name || 'Campus Student';
          const usernameEl = document.getElementById('dash-username');
          if (usernameEl) usernameEl.innerText = profileData.user?.username || 'username';
          
          const verificationEl = document.getElementById('dash-verification-status');
          if (verificationEl) {
            verificationEl.innerHTML = profileData.is_verified ? 
              `<span class="text-green-600 dark:text-green-400 flex items-center gap-1 text-xs font-semibold"><span class="material-symbols-outlined text-sm">check_circle</span>Verified Student</span>` : 
              `<span class="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-xs font-semibold"><span class="material-symbols-outlined text-sm">cancel</span>Unverified Account</span>`;
          }
        }

        if (itemsRes.ok) {
          const allItems = await itemsRes.json();
          // Filter to postings owned by this profile
          const filterId = isOwnProfile ? profileData.id : targetId;
          myItems = allItems.results ? allItems.results.filter(item => item.owner && item.owner.id === filterId) : [];
        }

        if (claimsRes.ok && isOwnProfile) {
          const claimsJson = await claimsRes.json();
          // Resolve paginated response results array
          claimsData = claimsJson.results || [];
        }
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      }
    };

    const renderTab = () => {
      switchTabBtn(currentTab);

      if (currentTab === 'profile') {
        renderProfile();
      } else if (currentTab === 'overview') {
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

    // TAB: PROFILE
    const renderProfile = () => {
      const lostItems = myItems.filter(item => item.item_type === 'lost');
      const foundItems = myItems.filter(item => item.item_type === 'found');

      const lostItemsHtml = lostItems.length === 0 
        ? `<p class="text-slate-500 text-sm italic">No lost items posted.</p>`
        : lostItems.map(item => `
            <div class="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:shadow-sm transition-all cursor-pointer" onclick="window.location.hash='#/items/${item.id}'">
              <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                ${item.thumbnail ? `<img src="${item.thumbnail}" class="w-full h-full object-cover"/>` : '<span class="material-symbols-outlined text-slate-400">image</span>'}
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="font-bold text-slate-800 dark:text-white truncate text-sm">${item.title}</h5>
                <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold uppercase">${item.status}</span>
              </div>
            </div>
          `).join('');

      const foundItemsHtml = foundItems.length === 0 
        ? `<p class="text-slate-500 text-sm italic">No found items posted.</p>`
        : foundItems.map(item => `
            <div class="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:shadow-sm transition-all cursor-pointer" onclick="window.location.hash='#/items/${item.id}'">
              <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                ${item.thumbnail ? `<img src="${item.thumbnail}" class="w-full h-full object-cover"/>` : '<span class="material-symbols-outlined text-slate-400">image</span>'}
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="font-bold text-slate-800 dark:text-white truncate text-sm">${item.title}</h5>
                <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold uppercase">${item.status}</span>
              </div>
            </div>
          `).join('');

      tabContent.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
          <div class="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-primary/20 shrink-0">
              <img src="${profileData.profile_picture_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXuyMvuk0imR0E1bUgkh_20NE5HGS1Cw-uNCCYGRS0JucK9YimIGsiJXX-faZQiB3qgaReF7vuhQpvyoBPOostf6qEhrH9pS9rYQiYyinEVzjwBwyv5BNp7k5Mq5NqVG9fRU_xXfKrxuEx_LbHxovWk-2dEvcEXiDiuR_DP7yk7aN0bqaGsgCwQzbqtoLn4-99Ggpsg_vAs7fbjeAnBXn2dfGGuyookJ5yIpOMOr_tofvCPanw5OY8-d6uiJdXMOMtGGGWSSBg7QG9'}" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 text-center sm:text-left">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${profileData.full_name || 'Campus Student'}</h3>
                ${profileData.is_verified ? '<span class="text-green-600 flex items-center gap-0.5 justify-center text-xs font-bold uppercase"><span class="material-symbols-outlined text-sm">verified</span>Verified</span>' : ''}
              </div>
              <p class="text-slate-500 text-sm mt-1">@${profileData.user?.username || 'username'}</p>
              <div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 justify-center sm:justify-start">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">location_on</span>
                  <span>${profileData.campus_location || 'No primary location'}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">calendar_today</span>
                  <span>Joined ${profileData.created_at ? new Date(profileData.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Recently'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">About</h4>
            <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">${profileData.bio || 'No biography details provided.'}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">My Lost Items (${lostItems.length})</h4>
              <div class="flex flex-col gap-3">${lostItemsHtml}</div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">My Found Items (${foundItems.length})</h4>
              <div class="flex flex-col gap-3">${foundItemsHtml}</div>
            </div>
          </div>
        </div>
      `;
    };

    // TAB 1: OVERVIEW
    const renderOverview = () => {
      const lostCount = profileData.total_items_lost || 0;
      const foundCount = profileData.total_items_found || 0;
      const successCount = profileData.total_successful_claims || 0;

      const totalClaimsCount = claimsData.length;
      const pendingClaimsCount = claimsData.filter(c => c.status === 'pending').length;
      const approvedClaimsCount = claimsData.filter(c => c.status === 'approved').length;
      const resolvedClaimsCount = claimsData.filter(c => c.status === 'resolved').length;

      // Construct activity timeline feed
      const activities = [];
      myItems.forEach(item => {
        activities.push({
          title: `Posted ${item.item_type}: ${item.title}`,
          date: new Date(item.created_at || new Date()),
          icon: item.item_type === 'lost' ? 'error_outline' : 'search_check',
          iconColor: item.item_type === 'lost' ? 'text-red-500 bg-red-50 dark:bg-red-950/30' : 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
          link: `#/items/${item.id}`
        });
      });
      claimsData.forEach(claim => {
        const isMyClaim = claim.claimer && claim.claimer.id === profileData.id;
        const itemTitle = claim.item_details?.title || 'Unknown Item';
        const date = new Date(claim.created_at || new Date());
        
        if (isMyClaim) {
          activities.push({
            title: `Submitted claim on ${itemTitle}`,
            date: date,
            icon: 'assignment_turned_in',
            iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
            link: `#/items/${claim.item_details?.id}`
          });
          if (claim.status === 'approved') {
            activities.push({
              title: `Claim approved for ${itemTitle}`,
              date: new Date(claim.updated_at || new Date()),
              icon: 'check_circle',
              iconColor: 'text-green-500 bg-green-50 dark:bg-green-950/30',
              link: `#/chat`
            });
          }
        } else {
          activities.push({
            title: `Received claim on ${itemTitle}`,
            date: date,
            icon: 'assignment_returned',
            iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
            link: `#/dashboard`
          });
        }
      });
      activities.sort((a, b) => b.date - a.date);
      const recentActivities = activities.slice(0, 5);

      const activitiesHtml = recentActivities.length === 0
        ? `<p class="text-slate-500 text-sm italic py-4">No recent activity on your items or claims.</p>`
        : recentActivities.map(act => `
            <div class="flex items-center gap-3 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
              <span class="material-symbols-outlined p-2 rounded-xl text-lg shrink-0 ${act.iconColor}">${act.icon}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">${act.title}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">${act.date.toLocaleString()}</p>
              </div>
              <a href="${act.link}" class="text-xs text-primary font-bold hover:underline shrink-0">View</a>
            </div>
          `).join('');

      tabContent.innerHTML = `
        <!-- Metrics Row -->
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
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">My Postings</span>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-extrabold text-slate-800 dark:text-white">${myItems.length}</span>
            </div>
            <span class="text-xs text-slate-500 font-medium">Total items listed</span>
          </div>

          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Success</span>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-extrabold text-green-600">${successCount}</span>
            </div>
            <span class="text-xs text-slate-500 font-medium">Reunions completed</span>
          </div>
        </div>

        <!-- Claim Status Analytics Boxes -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800 flex flex-col">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Claims</span>
            <span class="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">${totalClaimsCount}</span>
          </div>
          <div class="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-xl border border-amber-100/30 dark:border-amber-900/10 flex flex-col">
            <span class="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Pending Claims</span>
            <span class="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">${pendingClaimsCount}</span>
          </div>
          <div class="bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/30 dark:border-blue-900/10 flex flex-col">
            <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Approved Claims</span>
            <span class="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">${approvedClaimsCount}</span>
          </div>
          <div class="bg-green-50/50 dark:bg-green-950/10 p-4 rounded-xl border border-green-100/30 dark:border-green-900/10 flex flex-col">
            <span class="text-[10px] font-bold text-green-500 uppercase tracking-wider">Resolved Claims</span>
            <span class="text-xl font-extrabold text-green-600 dark:text-green-400 mt-1">${resolvedClaimsCount}</span>
          </div>
        </div>

        <!-- Charts Layout Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider">Activity Comparison</h4>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="overview-bar-chart" class="w-full h-full"></canvas>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider">Item Postings Distribution</h4>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="overview-pie-chart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <!-- Activity Feed & Proximity Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <!-- Recent Activity (Col span 2) -->
          <div class="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 class="text-lg font-bold mb-4 dark:text-white">Recent Activities</h3>
            <div class="flex flex-col">${activitiesHtml}</div>
          </div>
          
          <!-- Campus Proximity details -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 class="text-lg font-bold dark:text-white">Location Proximity</h3>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Proximity Location</span>
                <span class="text-sm font-bold text-primary mt-0.5">${profileData.campus_location || 'Not set'}</span>
              </div>
              <div class="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Found</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">${foundCount}</span>
              </div>
              <div class="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Lost</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">${lostCount}</span>
              </div>
            </div>
          </div>
        </div>
      `;

      // Instantiate ChartJS charts after element renders
      setTimeout(() => {
        const ctxBar = document.getElementById('overview-bar-chart')?.getContext('2d');
        const ctxPie = document.getElementById('overview-pie-chart')?.getContext('2d');

        if (ctxBar) {
          new Chart(ctxBar, {
            type: 'bar',
            data: {
              labels: ['Lost Items', 'Found Items', 'Successes'],
              datasets: [{
                label: 'Count',
                data: [lostCount, foundCount, successCount],
                backgroundColor: [
                  'rgba(239, 68, 68, 0.75)',  // Red
                  'rgba(59, 130, 246, 0.75)', // Blue
                  'rgba(16, 185, 129, 0.75)'  // Green
                ],
                borderColor: [
                  'rgb(239, 68, 68)',
                  'rgb(59, 130, 246)',
                  'rgb(16, 185, 129)'
                ],
                borderWidth: 1.5,
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 }
                }
              }
            }
          });
        }

        if (ctxPie) {
          new Chart(ctxPie, {
            type: 'doughnut',
            data: {
              labels: ['Lost Items', 'Found Items'],
              datasets: [{
                data: [lostCount, foundCount],
                backgroundColor: [
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(59, 130, 246, 0.8)'
                ],
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { boxWidth: 12 }
                }
              }
            }
          });
        }
      }, 0);
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
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            ${item.thumbnail ? `<img src="${item.thumbnail}" class="w-full h-full object-cover"/>` : '<span class="material-symbols-outlined text-slate-400 text-3xl">image</span>'}
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
      // Claims made on items POSTED by current user
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

      // Wire claim action event listeners
      document.querySelectorAll('.claim-act-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const claimId = btn.dataset.claimId;
          const action = btn.dataset.action;
          
          btn.disabled = true;
          const originalContent = btn.innerHTML;
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
              btn.innerHTML = originalContent;
            }
          } catch (error) {
            console.error('Claim action error:', error);
            btn.disabled = false;
            btn.innerHTML = originalContent;
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
              <input type="text" id="prof-name" class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" value="${profileData.full_name || ''}" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="prof-phone" class="text-xs font-bold text-slate-600">Phone Number</label>
              <input type="text" id="prof-phone" class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" value="${profileData.phone_number || ''}" placeholder="e.g. +1 555-0199" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="prof-loc" class="text-xs font-bold text-slate-600">Primary Campus Location</label>
              <input type="text" id="prof-loc" class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" value="${profileData.campus_location || ''}" placeholder="e.g. Main Library, Student Union" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="prof-bio" class="text-xs font-bold text-slate-600">Bio</label>
              <textarea id="prof-bio" class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm h-24 dark:text-white" placeholder="Brief description about yourself...">${profileData.bio || ''}</textarea>
            </div>

            <button type="submit" id="btn-update-prof" disabled class="w-fit px-8 h-11 bg-primary text-white font-bold text-xs rounded-xl shadow opacity-50 cursor-not-allowed transition-all">
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
              <input type="file" id="file-avatar" accept="image/*" class="text-xs dark:text-slate-300" />
              <button type="submit" id="btn-upload-avatar" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-lg transition-colors">
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
              <input type="password" id="old-pass" required class="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" placeholder="••••••••" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="new-pass" class="text-xs font-bold text-slate-600">New Password</label>
              <input type="password" id="new-pass" required class="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" placeholder="••••••••" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="new-pass2" class="text-xs font-bold text-slate-600">Confirm New Password</label>
              <input type="password" id="new-pass2" required class="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" placeholder="••••••••" />
            </div>

            <button type="submit" id="btn-change-pass" disabled class="w-fit px-8 h-10 bg-slate-800 text-white font-bold text-xs rounded-xl opacity-50 cursor-not-allowed transition-all">
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

      // Set up disabled/input listeners for forms
      const updateForm = document.getElementById('form-update-profile');
      const updateBtn = document.getElementById('btn-update-prof');
      const updateInputs = updateForm.querySelectorAll('input, textarea');
      
      updateInputs.forEach(input => {
        input.addEventListener('input', () => {
          updateBtn.disabled = false;
          updateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          updateBtn.classList.add('hover:bg-primary/95');
        });
      });

      const passForm = document.getElementById('form-change-password');
      const passBtn = document.getElementById('btn-change-pass');
      const passInputs = passForm.querySelectorAll('input');

      passInputs.forEach(input => {
        input.addEventListener('input', () => {
          passBtn.disabled = false;
          passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          passBtn.classList.add('hover:bg-slate-900');
        });
      });

      // Handle profile update
      updateForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateBtn.disabled = true;
        const originalText = updateBtn.innerHTML;
        updateBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-xs">sync</span> Saving...`;

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
            updateBtn.disabled = true;
            updateBtn.classList.add('opacity-50', 'cursor-not-allowed');
            updateBtn.classList.remove('hover:bg-primary/95');
          } else {
            const errs = await res.json();
            showAlert(JSON.stringify(errs), false);
            updateBtn.disabled = false;
            updateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          }
        } catch (error) {
          console.error(error);
          showAlert('Failed to connect to server.', false);
          updateBtn.disabled = false;
          updateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } finally {
          updateBtn.innerHTML = originalText;
        }
      });

      // Handle avatar upload
      document.getElementById('form-upload-avatar')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file-avatar');
        if (fileInput.files.length === 0) return;

        const submitBtn = document.getElementById('btn-upload-avatar');
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-xs">sync</span> Uploading...`;

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
          submitBtn.innerHTML = originalText;
        }
      });

      // Handle change password
      passForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('old-pass').value;
        const newPass = document.getElementById('new-pass').value;
        const newPass2 = document.getElementById('new-pass2').value;

        if (newPass !== newPass2) {
          showAlert('New passwords do not match.', false);
          return;
        }

        passBtn.disabled = true;
        const originalText = passBtn.innerHTML;
        passBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-xs">sync</span> Changing...`;

        try {
          const res = await api.post('/api/profiles/change_password/', {
            old_password: oldPass,
            new_password: newPass,
            new_password2: newPass2,
          });

          if (res.ok) {
            showAlert('Password changed successfully.');
            passForm.reset();
            passBtn.disabled = true;
            passBtn.classList.add('opacity-50', 'cursor-not-allowed');
            passBtn.classList.remove('hover:bg-slate-900');
          } else {
            const errs = await res.json();
            showAlert(errs.old_password || errs.new_password || 'Password change failed.', false);
            passBtn.disabled = false;
            passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          }
        } catch (error) {
          console.error(error);
          showAlert('Server error.', false);
          passBtn.disabled = false;
          passBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } finally {
          passBtn.innerHTML = originalText;
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
