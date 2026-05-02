class IDEApp {
  constructor() {
    this.isAiTyping = false;
    this.init();
  }

  async init() {
    this.renderModes();
    this.showWelcomeMsg();
    if (!window.aiEngine.apiKey) setTimeout(() => this.openSettings(), 800);
    
    // Listen for messages from VS Code extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'activeCode':
                if (message.value) {
                    const inp = document.getElementById('ai-input');
                    const lang = message.value.lang || 'plaintext';
                    inp.value += (inp.value ? '\n\n' : '') + '```' + lang + '\n' + message.value.code + '\n```';
                    this.autoResize(inp);
                    this.toast('Code inserted from editor');
                } else {
                    this.toast('No active code selected in editor');
                }
                break;
        }
    });

    if (window.localAI) window.localAI.startAutoLearning();
  }

  renderModes() {
    const row = document.getElementById('mode-row');
    row.innerHTML = '';
    Object.entries(AI_MODES).forEach(([key, m]) => {
      const btn = document.createElement('button');
      btn.className = 'mode-btn' + (key === 'NORMAL' ? ' active' : '');
      btn.id = `mode-${key}`;
      btn.innerHTML = `${m.icon} ${m.name}`;
      btn.title = m.description;
      btn.onclick = () => this.setMode(key);
      row.appendChild(btn);
    });
  }

  setMode(key) {
    window.aiEngine.setMode(key);
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`mode-${key}`)?.classList.add('active');
    const m = AI_MODES[key];
    document.getElementById('ai-mode-label').textContent = `${key} MODE · Gemini`;
    document.getElementById('ai-hint').textContent = m.hint;
    this.toast(`Switched to ${m.icon} ${key} MODE`);
  }

  showWelcomeMsg() {
    this.appendAIMsg(`## 👋 Welcome to EliteCode AI!
I'm your **Elite AI Coding Assistant** — a hybrid of Senior Software Engineer, Architect, Debugger, and Researcher.

**Available modes:**
- ⚡ **NORMAL** — General coding help
- 🐛 **DEBUG** — Error analysis & fixing  
- 🏛️ **ARCHITECT** — System design
- 🔬 **RESEARCH** — Deep analysis
- 🔍 **REVIEW** — Strict code review

> Set your **Gemini API key** (🔑 button) to get started!`, 'ai');
  }

  appendAIMsg(text, role) {
    const msgs = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = 'msg';
    const isAI = role === 'ai';
    const avatar = isAI ? '<div class="msg-avatar ai">⚡</div>' : '<div class="msg-avatar user">U</div>';
    const name = isAI ? 'Elite AI' : 'You';
    const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    let bubble = '';
    if (isAI) {
      const rendered = marked.parse(text);
      bubble = `<div class="msg-bubble ai">${this.enhanceMarkdown(rendered)}</div>`;
    } else {
      bubble = `<div class="msg-bubble user">${text.replace(/</g,'&lt;')}</div>`;
    }
    div.innerHTML = `<div class="msg-header">${avatar}<span>${name}</span><span style="opacity:0.5;margin-left:auto">${time}</span></div>${bubble}`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  enhanceMarkdown(html) {
    return html.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (match, attrs, code) => {
      const raw = code.replace(/<[^>]+>/g, '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
      const escaped = JSON.stringify(raw).replace(/"/g, '&quot;');
      return `<div class="code-block-wrap"><pre><code${attrs}>${code}</code></pre>
        <button class="code-copy-btn" onclick="ideApp.copyCode(${escaped},this)">Copy</button>
        <button class="send-to-editor-btn" onclick="ideApp.sendToEditor(${escaped})">↗ Insert at Cursor</button></div>`;
    });
  }

  copyCode(code, btn) {
    navigator.clipboard.writeText(code).then(() => { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 1500); });
  }

  sendToEditor(code) {
    vscode.postMessage({ type: 'insertCode', value: code });
  }

  insertActiveCode() {
    vscode.postMessage({ type: 'getActiveCode' });
  }

  async sendMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text || this.isAiTyping) return;
    if (!window.aiEngine.apiKey) { this.openSettings(); return; }

    input.value = '';
    this.autoResize(input);
    this.appendAIMsg(text, 'user');
    this.isAiTyping = true;
    document.getElementById('ai-send-btn').disabled = true;

    // Show typing indicator
    const msgs = document.getElementById('ai-messages');
    const typing = document.createElement('div');
    typing.className = 'msg';
    typing.innerHTML = `<div class="msg-header"><div class="msg-avatar ai">⚡</div><span>Elite AI</span></div>
      <div class="msg-bubble ai">...</div>`;
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    try {
      let fullText = '';
      let aiMsgDiv = null;

      await window.aiEngine.sendMessage(text, (chunk, full) => {
        fullText = full;
        typing.remove();
        if (!aiMsgDiv) {
          aiMsgDiv = this.appendAIMsg(full, 'ai');
        } else {
          const bubble = aiMsgDiv.querySelector('.msg-bubble.ai');
          if (bubble) bubble.innerHTML = this.enhanceMarkdown(marked.parse(full));
          msgs.scrollTop = msgs.scrollHeight;
        }
      });

      if (!aiMsgDiv && fullText) { typing.remove(); this.appendAIMsg(fullText, 'ai'); }
    } catch (err) {
      typing.remove();
      if (err.message === 'NO_API_KEY') {
        this.appendAIMsg('⚠️ No API key set. Click 🔑 to add your Gemini API key.', 'ai');
        this.openSettings();
      } else {
        this.appendAIMsg(`❌ Error: ${err.message}\n\nCheck your API key or internet connection.`, 'ai');
      }
    } finally {
      this.isAiTyping = false;
      document.getElementById('ai-send-btn').disabled = false;
      input.focus();
    }
  }

  clearChat() {
    document.getElementById('ai-messages').innerHTML = '';
    window.aiEngine.clearHistory();
    this.showWelcomeMsg();
    this.toast('Chat cleared');
  }

  aiInputKey(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); this.sendMessage(); }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); this.sendMessage(); }
  }

  autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }

  openSettings() {
    const modal = document.getElementById('api-modal');
    modal.classList.remove('hidden');
    const inp = document.getElementById('api-key-input');
    inp.value = window.aiEngine.apiKey || '';
    inp.focus();
  }

  saveApiKey() {
    const key = document.getElementById('api-key-input').value.trim();
    if (!key) { this.toast('Please enter an API key'); return; }
    window.aiEngine.setApiKey(key);
    this.closeModal();
    this.toast('API key saved! AI is ready.');
  }

  closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  toast(msg) {
    vscode.postMessage({ type: 'toast', value: msg });
  }
}

window.ideApp = new IDEApp();
