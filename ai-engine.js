// AI Engine v2 — Local AI + Gemini API + File Context
const AI_MODES = {
  NORMAL:    { name:'NORMAL',    icon:'⚡', color:'#4ec9b0', description:'Default coding help',           hint:'Ask anything about code...' },
  DEBUG:     { name:'DEBUG',     icon:'🐛', color:'#f44747', description:'Error fixing & root cause',     hint:'Paste your error or buggy code...' },
  ARCHITECT: { name:'ARCHITECT', icon:'🏛️', color:'#569cd6', description:'System design & architecture', hint:'Describe the system to design...' },
  RESEARCH:  { name:'RESEARCH',  icon:'🔬', color:'#dcdcaa', description:'Deep analysis & research',     hint:'What do you want to research?' },
  REVIEW:    { name:'REVIEW',    icon:'🔍', color:'#ce9178', description:'Strict code review',            hint:'Paste the code to review...' },
};

const SYSTEM_PROMPT = `You are an elite AI software engineering assistant embedded inside an IDE called EliteCode AI.
You are a hybrid of Senior Engineer (15+ years), Architect, Debugger, Researcher, and Code Reviewer.

ALWAYS structure responses:
1. 🧠 Understanding — restate what user wants
2. ⚙️ Plan — step-by-step approach  
3. 💻 Implementation — clean, production-ready code with comments
4. 🧪 Validation — edge cases, errors to handle
5. 🚀 Improvements — better alternatives

RULES:
- Use Markdown formatting always
- Write clean, modular, commented code
- Include error handling in every code block
- Warn about security vulnerabilities
- When given file content, analyze it carefully and refer to specific line numbers
- When suggesting file changes, show the complete modified code
- Correctness > Clarity > Performance > Cleverness`;

const MODE_PROMPTS = {
  NORMAL:    'Current Mode: NORMAL — General coding help.',
  DEBUG:     'Current Mode: DEBUG — Find root cause, explain why it happens (simple+technical), provide exact fix, suggest prevention.',
  ARCHITECT: 'Current Mode: ARCHITECT — Provide architecture diagram (ASCII), components, data flow, tech stack with trade-offs, scalability plan.',
  RESEARCH:  'Current Mode: RESEARCH — Decompose problem → hypotheses → multi-perspective analysis → trade-offs → risks → final recommendation.',
  REVIEW:    'Current Mode: REVIEW — Rate code 1-10, list ALL bad practices found, security issues, performance problems, suggest specific improvements with code.',
};

class AIEngine {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
    this.currentMode = 'NORMAL';
    this.history = [];
    this.model = 'gemini-2.0-flash';
    this.attachedFiles = []; // files attached as context
  }

  setApiKey(k) { this.apiKey = k.trim(); localStorage.setItem('gemini_api_key', this.apiKey); }
  setMode(m) { this.currentMode = m; if (window.localAI) window.localAI.setMode(m); }
  clearHistory() { this.history = []; this.attachedFiles = []; }
  hasApiKey() { return this.apiKey.length > 10; }

  attachFile(name, content) {
    this.attachedFiles = this.attachedFiles.filter(f => f.name !== name);
    this.attachedFiles.push({ name, content });
  }

  detachFile(name) {
    this.attachedFiles = this.attachedFiles.filter(f => f.name !== name);
  }

  buildFileContext() {
    if (!this.attachedFiles.length) return '';
    const parts = this.attachedFiles.map(f =>
      `=== FILE: ${f.name} ===\n\`\`\`\n${f.content}\n\`\`\``
    );
    return '\n\n--- ATTACHED FILES (analyze these) ---\n' + parts.join('\n\n') + '\n--- END FILES ---\n\n';
  }

  async sendMessage(userMsg, onChunk) {
    if (this.hasApiKey()) {
      try {
        return await this.geminiStream(userMsg, onChunk);
      } catch (err) {
        if (err.message === 'INVALID_KEY') throw err;
        // fallback to local on network error
        console.warn('Gemini failed, using local AI:', err);
        return window.localAI.respond(userMsg, onChunk);
      }
    }
    return window.localAI.respond(userMsg, onChunk);
  }

  async geminiStream(userMsg, onChunk) {
    const fileCtx = this.buildFileContext();
    const fullMsg = fileCtx ? fileCtx + userMsg : userMsg;
    const sysPrompt = SYSTEM_PROMPT + '\n\n' + MODE_PROMPTS[this.currentMode];

    const contents = [
      ...this.history,
      { role: 'user', parts: [{ text: fullMsg }] }
    ];

    const body = {
      system_instruction: { parts: [{ text: sysPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (netErr) {
      throw new Error('Network error — check internet connection');
    }

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        errMsg = j?.error?.message || errMsg;
        if (res.status === 400 && errMsg.includes('API_KEY')) throw Object.assign(new Error(errMsg), { message: 'INVALID_KEY' });
        if (res.status === 403) throw Object.assign(new Error('Invalid API key'), { message: 'INVALID_KEY' });
      } catch (e) { if (e.message === 'INVALID_KEY') throw e; }
      throw new Error(errMsg);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let full = '', buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      
      // SSE events are separated by double newlines
      const parts = buf.split(/\n\n|\r\n\r\n/);
      buf = parts.pop() || '';
      
      for (const part of parts) {
        const dataIndex = part.indexOf('data: ');
        if (dataIndex === -1) continue;
        
        const raw = part.slice(dataIndex + 6).trim();
        if (raw === '[DONE]' || raw === '') continue;
        
        try {
          const parsed = JSON.parse(raw);
          const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (chunk) { 
            full += chunk; 
            if (onChunk) onChunk(chunk, full); 
          }
        } catch (e) {
          console.error("SSE Parse Error:", e, "Raw data:", raw);
        }
      }
    }

    // save to history (without file context to save tokens)
    this.history.push({ role: 'user', parts: [{ text: userMsg }] });
    this.history.push({ role: 'model', parts: [{ text: full }] });

    // keep history under 20 messages
    if (this.history.length > 20) this.history = this.history.slice(-20);

    this.parseFileOps(full);
    return full;
  }

  parseFileOps(text) {
    const ops = [];
    (text.match(/\[CREATE FILE: ([^\]]+)\]/g) || []).forEach(m => {
      ops.push({ type: 'create', path: m.match(/\[CREATE FILE: ([^\]]+)\]/)[1] });
    });
    (text.match(/\[UPDATE FILE: ([^\]]+)\]/g) || []).forEach(m => {
      ops.push({ type: 'update', path: m.match(/\[UPDATE FILE: ([^\]]+)\]/)[1] });
    });
    if (ops.length && window.ideApp) window.ideApp.handleFileOps(ops);
  }
}

window.aiEngine = new AIEngine();
window.AI_MODES = AI_MODES;
