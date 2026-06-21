import { state } from '../state.js';

export default {
  async render() {
    return `
      <div class="max-w-7xl mx-auto my-6 px-4 md:px-8 animate-fade-in">
        <div class="h-[calc(100vh-12rem)] min-h-[500px] w-full flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <!-- Sidebar: Conversations List -->
          <aside class="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 shrink-0">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800">
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input id="chat-search" class="w-full rounded-xl bg-slate-50 border-none py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary/20" placeholder="Search chats..." type="text"/>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto" id="chat-threads-list">
              <!-- Conversation Threads -->
              <div class="chat-thread-item flex cursor-pointer items-center gap-3 border-l-4 border-primary bg-primary/5 p-4 transition-colors" data-chat-id="keys">
                <div class="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <span class="material-symbols-outlined text-slate-400 text-2xl absolute inset-0 flex items-center justify-center bg-slate-200/50">vpn_key</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="truncate text-xs font-bold text-slate-800 dark:text-white">Dorm Keys</p>
                    <span class="text-[9px] text-slate-400" id="thread-time-keys">2:14 PM</span>
                  </div>
                  <p class="truncate text-[11px] text-slate-500" id="thread-preview-keys">Yes, they do! I found them near...</p>
                </div>
              </div>

              <div class="chat-thread-item flex cursor-pointer items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" data-chat-id="bottle">
                <div class="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <span class="material-symbols-outlined text-slate-400 text-2xl absolute inset-0 flex items-center justify-center bg-slate-200/50">water_drop</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="truncate text-xs font-bold text-slate-800 dark:text-white">Water Bottle</p>
                    <span class="text-[9px] text-slate-400">Yesterday</span>
                  </div>
                  <p class="truncate text-[11px] text-slate-500">Is it the blue Hydroflask?</p>
                </div>
              </div>
            </div>
          </aside>

          <!-- Chat Window -->
          <section class="flex flex-1 flex-col bg-white dark:bg-slate-950">
            <!-- Item-Context Header -->
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 shadow-sm z-10 shrink-0">
              <div class="flex items-center gap-4">
                <div class="h-10 w-10 overflow-hidden rounded-lg border border-slate-200 shrink-0 flex items-center justify-center bg-slate-50 text-slate-500">
                  <span class="material-symbols-outlined" id="chat-header-icon">vpn_key</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-bold text-slate-800 dark:text-white" id="chat-header-title">Found: Dorm Keys</h3>
                    <span class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">Active</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span id="chat-header-subtitle">Chatting with Alex River</span>
                    <span class="flex items-center gap-0.5 text-primary font-bold">
                      <span class="material-symbols-outlined text-[12px]">verified</span> Verified Student
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Feed -->
            <div class="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/30 p-6 space-y-4" id="chat-message-feed">
              <!-- Rendered dynamically -->
            </div>

            <!-- Message Input Area -->
            <div class="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0">
              <form id="form-chat-input" class="mx-auto flex max-w-4xl items-center gap-3">
                <div class="relative flex-1">
                  <input id="chat-message-input" autocomplete="off" class="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2.5 pl-5 pr-12 text-xs focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" placeholder="Type a message..." type="text"/>
                  <button type="submit" class="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-transform active:scale-95 shadow-sm">
                    <span class="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </form>
              <div class="mt-2 text-center">
                <p class="text-[10px] text-slate-400">Remember to meet in a public campus area for safety.</p>
              </div>
            </div>
          </section>

          <!-- Right Detail Panel (Safety tips) -->
          <aside class="hidden xl:flex w-60 flex-col border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shrink-0">
            <h4 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Safety Guidelines</h4>
            <ul class="space-y-4">
              <li class="flex gap-2">
                <span class="material-symbols-outlined text-primary text-sm shrink-0">groups</span>
                <p class="text-[11px] text-slate-600 dark:text-slate-300">Meet in public spaces (e.g. Student Union lobby).</p>
              </li>
              <li class="flex gap-2">
                <span class="material-symbols-outlined text-primary text-sm shrink-0">light_mode</span>
                <p class="text-[11px] text-slate-600 dark:text-slate-300">Schedule meetups during daylight hours.</p>
              </li>
              <li class="flex gap-2">
                <span class="material-symbols-outlined text-primary text-sm shrink-0">shield_person</span>
                <p class="text-[11px] text-slate-600 dark:text-slate-300">Do not exchange passwords or login codes.</p>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const feed = document.getElementById('chat-message-feed');
    const input = document.getElementById('chat-message-input');
    const form = document.getElementById('form-chat-input');
    const threadItems = document.querySelectorAll('.chat-thread-item');

    const chatHeaderTitle = document.getElementById('chat-header-title');
    const chatHeaderSubtitle = document.getElementById('chat-header-subtitle');
    const chatHeaderIcon = document.getElementById('chat-header-icon');

    // Sample data structures
    const conversations = {
      keys: {
        title: 'Found: Dorm Keys',
        subtitle: 'Chatting with Alex River',
        icon: 'vpn_key',
        messages: [
          { sender: 'them', name: 'Alex River', text: 'Hi! I think those might be mine. Do they have a blue keychain? I lost mine yesterday near the library.', time: '2:12 PM' },
          { sender: 'me', text: 'Yes, they do! I found them near the Student Union steps this morning. They were just sitting there on the ledge.', time: '2:14 PM' },
          { sender: 'them', name: 'Alex River', text: 'Oh that\'s amazing! I was so worried about getting back into my room. Are you free to meet up sometime today?', time: '2:15 PM' },
        ],
        botReplies: [
          "Perfect, thank you! I can meet tomorrow near the library entrance around 2 PM. Does that work for you?",
          "Awesome! I'll be wearing a yellow backpack. See you then! Thanks again!",
        ]
      },
      bottle: {
        title: 'Found: Water Bottle',
        subtitle: 'Chatting with Sam Taylor',
        icon: 'water_drop',
        messages: [
          { sender: 'them', name: 'Sam Taylor', text: 'Hi, is this the blue Hydroflask?', time: 'Yesterday' },
          { sender: 'me', text: 'Yes! It has a small scratch near the cap.', time: 'Yesterday' },
          { sender: 'them', name: 'Sam Taylor', text: 'Oh yes! That\'s definitely mine! I lost it during gym.', time: 'Yesterday' },
        ],
        botReplies: [
          "I'm so glad it was found! Let me know if you can meet near the Sports Complex tomorrow.",
        ]
      }
    };

    let activeChatId = 'keys';

    const renderMessages = () => {
      const chat = conversations[activeChatId];
      if (!chat) return;

      feed.innerHTML = `
        <div class="flex justify-center my-2">
          <span class="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-[10px] font-semibold text-slate-400 shadow-sm uppercase tracking-wider">Today</span>
        </div>
      `;

      chat.messages.forEach(msg => {
        if (msg.sender === 'them') {
          feed.innerHTML += `
            <div class="flex items-end gap-3 max-w-[85%] animate-fade-in">
              <div class="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center shrink-0 text-slate-400">
                <span class="material-symbols-outlined text-sm">person</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <p class="ml-1 text-[10px] font-bold text-slate-500">${msg.name}</p>
                <div class="rounded-2xl rounded-bl-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 text-xs text-slate-800 dark:text-slate-200 shadow-sm">
                  ${msg.text}
                </div>
                <span class="ml-1 mt-0.5 text-[9px] text-slate-400">${msg.time}</span>
              </div>
            </div>
          `;
        } else {
          feed.innerHTML += `
            <div class="ml-auto flex flex-col items-end gap-0.5 max-w-[85%] animate-fade-in">
              <div class="rounded-2xl rounded-br-none bg-primary p-3.5 text-xs text-white shadow-md shadow-primary/10">
                ${msg.text}
              </div>
              <span class="mr-1 mt-0.5 text-[9px] text-slate-400 flex items-center gap-0.5">${msg.time} <span class="material-symbols-outlined text-primary text-xs">done_all</span></span>
            </div>
          `;
        }
      });

      // Scroll to bottom
      feed.scrollTop = feed.scrollHeight;
    };

    const selectChat = (chatId) => {
      activeChatId = chatId;
      const chat = conversations[chatId];
      if (!chat) return;

      // Update header details
      chatHeaderTitle.innerText = chat.title;
      chatHeaderSubtitle.innerText = chat.subtitle;
      chatHeaderIcon.innerText = chat.icon;

      // Render messages
      renderMessages();
    };

    // Wire sidebar thread selection
    threadItems.forEach(item => {
      item.addEventListener('click', () => {
        // Clear active borders
        threadItems.forEach(i => {
          i.classList.remove('border-l-4', 'border-primary', 'bg-primary/5');
          i.classList.add('hover:bg-slate-50', 'dark:hover:bg-slate-800');
        });
        // Select this one
        item.classList.add('border-l-4', 'border-primary', 'bg-primary/5');
        item.classList.remove('hover:bg-slate-50', 'dark:hover:bg-slate-800');

        selectChat(item.dataset.chatId);
      });
    });

    // Handle sending message
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const chat = conversations[activeChatId];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append my message
      chat.messages.push({
        sender: 'me',
        text: text,
        time: now,
      });

      input.value = '';
      renderMessages();

      // Update previews
      const previewEl = document.getElementById(`thread-preview-${activeChatId}`);
      if (previewEl) previewEl.innerText = text;
      const timeEl = document.getElementById(`thread-time-${activeChatId}`);
      if (timeEl) timeEl.innerText = now;

      // Simulate Bot Response
      if (chat.botReplies && chat.botReplies.length > 0) {
        const nextReply = chat.botReplies.shift();
        setTimeout(() => {
          chat.messages.push({
            sender: 'them',
            name: activeChatId === 'keys' ? 'Alex River' : 'Sam Taylor',
            text: nextReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          renderMessages();
          
          if (previewEl) previewEl.innerText = nextReply;
        }, 1500);
      }
    });

    // Select initial chat
    selectChat('keys');
  }
};
