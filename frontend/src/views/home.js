import { state } from '../state.js';

export default {
  async render() {
    return `
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
        <div class="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div class="flex flex-col gap-8 flex-1">
            <div class="flex flex-col gap-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span class="material-symbols-outlined text-sm">verified_user</span>
                Official Campus Network
              </div>
              <h1 class="text-[#111418] dark:text-white text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
                Lost on campus? <span class="text-primary">You found it.</span>
              </h1>
              <p class="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-[600px]">
                The official campus lost and found. Free to use, powered by students, built on trust. 100% Free & Community-Driven.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <button id="btn-found-something" class="flex-1 sm:flex-none min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex gap-2 justify-center">
                <span class="material-symbols-outlined">add_circle</span>
                I found something
              </button>
              <button id="btn-lost-something" class="flex-1 sm:flex-none min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-[#111418] dark:text-white text-lg font-bold hover:border-primary/50 transition-all flex gap-2 justify-center">
                <span class="material-symbols-outlined">person_search</span>
                I lost something
              </button>
            </div>
            <!-- Trust Stats -->
            <div class="flex flex-wrap gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div class="flex flex-col">
                <span class="text-2xl font-bold text-primary">1,240+</span>
                <span class="text-sm text-slate-500 font-medium">Items Reported</span>
              </div>
              <div class="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
              <div class="flex flex-col">
                <span class="text-2xl font-bold text-primary">850+</span>
                <span class="text-sm text-slate-500 font-medium">Matches Made</span>
              </div>
              <div class="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
              <div class="flex flex-col">
                <span class="text-2xl font-bold text-primary">900+</span>
                <span class="text-sm text-slate-500 font-medium">Students Reunited</span>
              </div>
            </div>
          </div>
          <div class="flex-1 relative">
            <div class="w-full aspect-square max-w-[500px] mx-auto rounded-3xl bg-primary/5 overflow-hidden border border-primary/10 relative group">
              <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
              <img alt="Campus students helping each other" class="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeq8E6x6Pn6s9ksesansPoXPsm0WGo226txAoSKkfDB2ilHg-Ie8ix9eWTVTBefdttA852m4wCZhHnOQ766FpTk7KmDZ8-KFtK_sBb8wE7FQ20ckJHy2erVwVgRQ3BGusC2LDJEF60iI-nTnP5-9fQOrOgLEyZ5NQOjCXho3WsNNH6-LeEiLSa9K2MRRxnaWDHi9LbKBUYuVeQIKZIQD1afjrO2OhVaeKs9ccyoOEfHNkblOXf2KCbguPRkqq1HlIzEfUyrJuUUYjP"/>
              <!-- Floating UI element simulation -->
              <div class="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-2xl shadow-xl z-20 border border-white/20">
                <div class="flex items-center gap-4">
                  <div class="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold dark:text-white">Recent Match!</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Someone found your "Blue Hydroflask" at the Library.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="bg-white dark:bg-slate-900/50 py-20" id="how-it-works">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex flex-col items-center text-center gap-4 mb-16">
            <h2 class="text-primary text-sm font-bold uppercase tracking-widest italic">Process</h2>
            <h3 class="text-[#111418] dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Three simple steps to get your belongings back.</h3>
            <p class="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">We've streamlined the entire process from losing an item to the safe hand-off, so you can focus on your studies.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="flex flex-col gap-6 p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div class="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <span class="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <div class="flex flex-col gap-3">
                <h4 class="text-[#111418] dark:text-white text-xl font-bold">1. Post it</h4>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Snap a photo and mark the location on our interactive campus map where the item was found or lost.
                </p>
              </div>
            </div>
            <!-- Step 2 -->
            <div class="flex flex-col gap-6 p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div class="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <span class="material-symbols-outlined text-3xl">hub</span>
              </div>
              <div class="flex flex-col gap-3">
                <h4 class="text-[#111418] dark:text-white text-xl font-bold">2. Verify it</h4>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our intelligent matching engine compares descriptions and locations to alert owners automatically.
                </p>
              </div>
            </div>
            <!-- Step 3 -->
            <div class="flex flex-col gap-6 p-8 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div class="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <span class="material-symbols-outlined text-3xl">handshake</span>
              </div>
              <div class="flex flex-col gap-3">
                <h4 class="text-[#111418] dark:text-white text-xl font-bold">3. Retrieve it</h4>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Chat securely through the app and coordinate a safe meetup at designated campus spots to return the item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const handleButtonClick = (type) => {
      if (state.isAuthenticated) {
        window.location.hash = `#/items/new?type=${type}`;
      } else {
        window.location.hash = `#/login?redirect=items/new&type=${type}`;
      }
    };

    document.getElementById('btn-found-something')?.addEventListener('click', () => {
      handleButtonClick('found');
    });

    document.getElementById('btn-lost-something')?.addEventListener('click', () => {
      handleButtonClick('lost');
    });
  }
};
