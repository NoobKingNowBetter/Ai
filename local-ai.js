// LocalAI — Offline Coding Assistant Engine
class LocalAI {
  constructor() {
    this.memory = [];
    this.mode = 'NORMAL';
    this.kb = this.buildKB();
  }

  setMode(m) { this.mode = m; }

  buildKB() {
    return [
      // JavaScript
      { tags:['javascript','js','array'], code:true, answer:`## JavaScript Array Methods\n\`\`\`js\nconst arr = [1,2,3,4,5];\n\n// map — transform\nconst doubled = arr.map(x => x * 2);\n\n// filter — select\nconst evens = arr.filter(x => x % 2 === 0);\n\n// reduce — aggregate\nconst sum = arr.reduce((acc, x) => acc + x, 0);\n\n// find — first match\nconst found = arr.find(x => x > 3);\n\n// includes\nconsole.log(arr.includes(3)); // true\n\`\`\`` },
      { tags:['javascript','promise','async','await'], code:true, answer:`## Async/Await Pattern\n\`\`\`js\nasync function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Fetch failed:', err);\n    throw err;\n  }\n}\n\n// Usage\nfetchData('https://api.example.com/data')\n  .then(d => console.log(d))\n  .catch(e => console.error(e));\n\`\`\`` },
      { tags:['javascript','class','oop'], code:true, answer:`## JavaScript Class (OOP)\n\`\`\`js\nclass Animal {\n  #name; // private field\n  constructor(name, sound) {\n    this.#name = name;\n    this.sound = sound;\n  }\n  speak() {\n    return \`\${this.#name} says \${this.sound}\`;\n  }\n  get name() { return this.#name; }\n}\n\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, 'Woof');\n    this.tricks = [];\n  }\n  learn(trick) { this.tricks.push(trick); }\n}\n\nconst dog = new Dog('Rex');\nconsole.log(dog.speak()); // Rex says Woof\n\`\`\`` },
      // Python
      { tags:['python','list','dict'], code:true, answer:`## Python Collections\n\`\`\`python\n# List comprehension\nnumbers = [1,2,3,4,5]\nsquares = [x**2 for x in numbers if x % 2 == 0]\n\n# Dict comprehension\nword_len = {w: len(w) for w in ['hello','world','python']}\n\n# Named tuple\nfrom collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])\np = Point(3, 4)\nprint(p.x, p.y)\n\n# defaultdict\nfrom collections import defaultdict\ngraph = defaultdict(list)\ngraph['A'].append('B')\n\`\`\`` },
      { tags:['python','class','dataclass'], code:true, answer:`## Python Dataclass\n\`\`\`python\nfrom dataclasses import dataclass, field\nfrom typing import List\n\n@dataclass\nclass User:\n    name: str\n    email: str\n    age: int = 0\n    tags: List[str] = field(default_factory=list)\n\n    def is_adult(self) -> bool:\n        return self.age >= 18\n\n    def __post_init__(self):\n        self.email = self.email.lower()\n\nu = User('Alice', 'Alice@example.com', 25)\nprint(u.is_adult())  # True\n\`\`\`` },
      { tags:['python','async','asyncio'], code:true, answer:`## Python Asyncio\n\`\`\`python\nimport asyncio\nimport aiohttp\n\nasync def fetch(session, url):\n    async with session.get(url) as resp:\n        return await resp.json()\n\nasync def main():\n    urls = ['https://api.github.com/users/octocat']\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch(session, u) for u in urls]\n        results = await asyncio.gather(*tasks)\n        for r in results:\n            print(r)\n\nasyncio.run(main())\n\`\`\`` },
      // TypeScript
      { tags:['typescript','ts','interface','type'], code:true, answer:`## TypeScript Types\n\`\`\`ts\n// Interface\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // optional\n  readonly createdAt: Date;\n}\n\n// Generic function\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\n// Union type\ntype Status = 'pending' | 'active' | 'inactive';\n\n// Utility types\ntype PartialUser = Partial<User>;\ntype ReadonlyUser = Readonly<User>;\ntype UserKeys = keyof User;\n\`\`\`` },
      // Algorithms
      { tags:['algorithm','sort','bubble','quick','merge'], code:true, answer:`## Sorting Algorithms\n\`\`\`js\n// Quick Sort\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const mid = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), ...mid, ...quickSort(right)];\n}\n\n// Binary Search\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? lo = mid+1 : hi = mid-1;\n  }\n  return -1;\n}\n\`\`\`` },
      // Data Structures
      { tags:['data structure','linked list','stack','queue','tree'], code:true, answer:`## Data Structures\n\`\`\`js\n// Stack\nclass Stack {\n  #items = [];\n  push(x) { this.#items.push(x); }\n  pop() { return this.#items.pop(); }\n  peek() { return this.#items.at(-1); }\n  isEmpty() { return !this.#items.length; }\n}\n\n// Queue\nclass Queue {\n  #items = [];\n  enqueue(x) { this.#items.push(x); }\n  dequeue() { return this.#items.shift(); }\n  front() { return this.#items[0]; }\n  isEmpty() { return !this.#items.length; }\n}\n\n// Linked List Node\nclass Node { constructor(val) { this.val = val; this.next = null; } }\n\`\`\`` },
      // REST API
      { tags:['api','rest','express','node','server'], code:true, answer:`## Express REST API\n\`\`\`js\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\n// In-memory store\nlet items = [];\nlet nextId = 1;\n\n// GET all\napp.get('/api/items', (req, res) => res.json(items));\n\n// GET by id\napp.get('/api/items/:id', (req, res) => {\n  const item = items.find(i => i.id === +req.params.id);\n  if (!item) return res.status(404).json({ error: 'Not found' });\n  res.json(item);\n});\n\n// POST create\napp.post('/api/items', (req, res) => {\n  const item = { id: nextId++, ...req.body };\n  items.push(item);\n  res.status(201).json(item);\n});\n\n// DELETE\napp.delete('/api/items/:id', (req, res) => {\n  items = items.filter(i => i.id !== +req.params.id);\n  res.status(204).end();\n});\n\napp.listen(3000, () => console.log('API running on :3000'));\n\`\`\`` },
      // React
      { tags:['react','component','hook','useState','useEffect'], code:true, answer:`## React Component + Hooks\n\`\`\`jsx\nimport { useState, useEffect, useCallback } from 'react';\n\nfunction UserList({ endpoint }) {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  const fetchUsers = useCallback(async () => {\n    try {\n      setLoading(true);\n      const res = await fetch(endpoint);\n      if (!res.ok) throw new Error('Failed to fetch');\n      setUsers(await res.json());\n    } catch (e) {\n      setError(e.message);\n    } finally {\n      setLoading(false);\n    }\n  }, [endpoint]);\n\n  useEffect(() => { fetchUsers(); }, [fetchUsers]);\n\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}\n\`\`\`` },
      // SQL
      { tags:['sql','database','query','join','index'], code:true, answer:`## SQL Essentials\n\`\`\`sql\n-- Create table with constraints\nCREATE TABLE users (\n  id       SERIAL PRIMARY KEY,\n  name     VARCHAR(100) NOT NULL,\n  email    VARCHAR(255) UNIQUE NOT NULL,\n  created  TIMESTAMP DEFAULT NOW()\n);\n\n-- Index for performance\nCREATE INDEX idx_email ON users(email);\n\n-- JOIN\nSELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id\nWHERE o.total > 100\nORDER BY o.total DESC\nLIMIT 10;\n\n-- Aggregate\nSELECT user_id, COUNT(*) as cnt, SUM(total) as revenue\nFROM orders\nGROUP BY user_id\nHAVING COUNT(*) > 5;\n\`\`\`` },
      // Docker
      { tags:['docker','container','dockerfile','devops'], code:true, answer:`## Dockerfile Best Practices\n\`\`\`dockerfile\n# Multi-stage build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runtime\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]\n\`\`\`\n\n\`\`\`yaml\n# docker-compose.yml\nservices:\n  app:\n    build: .\n    ports: [\"3000:3000\"]\n    environment:\n      DATABASE_URL: postgres://user:pass@db/mydb\n  db:\n    image: postgres:15\n    volumes: [pgdata:/var/lib/postgresql/data]\nvolumes:\n  pgdata:\n\`\`\`` },
      // Git
      { tags:['git','commit','branch','merge','rebase'], answer:`## Git Workflow\n\`\`\`bash\n# Feature branch workflow\ngit checkout -b feature/my-feature\ngit add -p              # interactive staging\ngit commit -m \"feat: add my feature\"\ngit push origin feature/my-feature\n\n# Undo last commit (keep changes)\ngit reset --soft HEAD~1\n\n# Squash last 3 commits\ngit rebase -i HEAD~3\n\n# Stash work in progress\ngit stash push -m \"WIP: my work\"\ngit stash pop\n\n# Clean merged branches\ngit branch --merged | grep -v main | xargs git branch -d\n\`\`\`` },
      // Error patterns
      { tags:['null','undefined','cannot read','typeerror'], answer:`## 🐛 Null Reference Errors\n\n**Root Cause:** Accessing property on \`null\` or \`undefined\`.\n\n**Fix:**\n\`\`\`js\n// ✅ Optional chaining\nconst name = user?.profile?.name ?? 'Anonymous';\n\n// ✅ Guard clause\nfunction getUser(id) {\n  if (!id) throw new Error('ID required');\n  const user = db.find(id);\n  if (!user) throw new Error('User not found');\n  return user;\n}\n\n// ✅ Nullish coalescing\nconst port = process.env.PORT ?? 3000;\n\`\`\`\n\n**Prevention:** Use TypeScript strict mode or optional chaining everywhere.` },
      { tags:['cors','cors error','access-control','origin'], answer:`## 🐛 CORS Error Fix\n\n**Root Cause:** Browser blocks cross-origin requests without proper headers.\n\n**Express Fix:**\n\`\`\`js\nconst cors = require('cors');\napp.use(cors({\n  origin: ['http://localhost:3000', 'https://myapp.com'],\n  methods: ['GET','POST','PUT','DELETE'],\n  credentials: true\n}));\n\`\`\`\n\n**Prevention:** Always configure CORS on the server. Never use \`*\` in production.` },
      { tags:['memory leak','leak','performance','slow'], answer:`## 🐛 Memory Leak Detection\n\n**Common causes:**\n1. Event listeners not removed\n2. Intervals/timeouts not cleared\n3. Closures holding large objects\n\n**Fix:**\n\`\`\`js\n// ✅ Cleanup event listeners\nconst handler = () => doSomething();\nel.addEventListener('click', handler);\n// later:\nel.removeEventListener('click', handler);\n\n// ✅ Clear intervals\nconst id = setInterval(work, 1000);\n// later:\nclearInterval(id);\n\n// React useEffect cleanup\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // cleanup!\n}, []);\n\`\`\`` },
      // Architecture
      { tags:['architecture','design','system','microservice','scalab'], answer:`## 🏛️ System Architecture Patterns\n\n### Microservices\n\`\`\`\n[Client] → [API Gateway] → [Auth Service]\n                        → [User Service] → [User DB]\n                        → [Order Service] → [Order DB]\n                        → [Notification Service]\n\`\`\`\n\n**Tech Stack:**\n- API Gateway: Nginx / Kong\n- Services: Node.js / Go\n- Messaging: RabbitMQ / Kafka\n- DB per service: PostgreSQL / MongoDB\n- Container: Docker + Kubernetes\n\n**Trade-offs:**\n| Pro | Con |\n|-----|-----|\n| Independent deploy | Network overhead |\n| Scalable per service | Complex debugging |\n| Tech flexibility | Distributed transactions |` },
      { tags:['mvc','pattern','design pattern','singleton','factory'], answer:`## 🏛️ Design Patterns\n\n### MVC\n\`\`\`\nModel → Business logic + Data\nView → UI rendering\nController → Handles requests, calls Model, returns View\n\`\`\`\n\n### Singleton\n\`\`\`js\nclass Database {\n  static #instance;\n  static getInstance() {\n    if (!Database.#instance) Database.#instance = new Database();\n    return Database.#instance;\n  }\n}\n\`\`\`\n\n### Factory\n\`\`\`js\nfunction createLogger(type) {\n  const loggers = {\n    file: new FileLogger(),\n    console: new ConsoleLogger(),\n    remote: new RemoteLogger(),\n  };\n  return loggers[type] ?? loggers.console;\n}\n\`\`\`` },
      // Security
      { tags:['security','sql injection','xss','csrf','auth'], answer:`## 🔒 Security Best Practices\n\n### SQL Injection Prevention\n\`\`\`js\n// ❌ NEVER\ndb.query(\`SELECT * FROM users WHERE id = \${req.params.id}\`);\n\n// ✅ Parameterized query\ndb.query('SELECT * FROM users WHERE id = $1', [req.params.id]);\n\`\`\`\n\n### XSS Prevention\n\`\`\`js\n// Sanitize output\nconst clean = DOMPurify.sanitize(userInput);\n// CSP header\nres.setHeader('Content-Security-Policy', \"default-src 'self'\");\n\`\`\`\n\n### JWT Auth\n\`\`\`js\nconst jwt = require('jsonwebtoken');\nconst token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '7d' });\njwt.verify(token, process.env.SECRET);\n\`\`\`` },
      // HTML/CSS
      { tags:['html','css','flexbox','grid','layout'], code:true, answer:`## Modern CSS Layouts\n\`\`\`css\n/* Flexbox Center */\n.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\n/* CSS Grid Basic Layout */\n.grid-container {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 60px 1fr 50px;\n  gap: 16px;\n}\n\n/* Responsive Grid */\n.auto-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}\n\`\`\`` },
      // C++
      { tags:['cpp','c++','vector','pointer','class'], code:true, answer:`## C++ Fundamentals\n\`\`\`cpp\n#include <iostream>\n#include <vector>\n#include <memory>\n\nclass Entity {\npublic:\n    Entity() { std::cout << "Created\\n"; }\n    ~Entity() { std::cout << "Destroyed\\n"; }\n};\n\nint main() {\n    // Smart pointers (Modern C++)\n    {\n        std::shared_ptr<Entity> e0;\n        {\n            std::shared_ptr<Entity> sharedEntity = std::make_shared<Entity>();\n            e0 = sharedEntity;\n        }\n    }\n\n    // Vectors\n    std::vector<int> numbers = {1, 2, 3, 4};\n    for(int n : numbers) {\n        std::cout << n << " ";\n    }\n    return 0;\n}\n\`\`\`` },
      // Rust
      { tags:['rust','ownership','borrowing','struct'], code:true, answer:`## Rust Basics\n\`\`\`rust\nstruct User {\n    username: String,\n    active: bool,\n}\n\nfn main() {\n    let mut s1 = String::from("hello");\n    change(&mut s1);\n    println!("{}", s1);\n\n    let user1 = User {\n        username: String::from("admin"),\n        active: true,\n    };\n}\n\n// Borrowing and Mutability\nfn change(some_string: &mut String) {\n    some_string.push_str(", world");\n}\n\`\`\`` },
    ];
  }

  score(input, entry) {
    const q = input.toLowerCase();
    return entry.tags.reduce((s, t) => s + (q.includes(t) ? 2 : 0), 0);
  }

  detectIntent(input) {
    const q = input.toLowerCase();
    if (/\berror\b|fix|bug|crash|fail|undefined|null|exception|traceback/.test(q)) return 'DEBUG';
    if (/design|architect|system|scale|microservice|structure/.test(q)) return 'ARCHITECT';
    if (/review|check|rate|quality|bad|improve|refactor/.test(q)) return 'REVIEW';
    if (/research|compare|best|difference|vs|pros|cons/.test(q)) return 'RESEARCH';
    return 'NORMAL';
  }

  generateCode(spec) {
    const q = spec.toLowerCase();
    if (/function|def|method/.test(q)) return this.genericFunction(spec);
    if (/class/.test(q)) return this.genericClass(spec);
    if (/api|endpoint|route/.test(q)) return this.genericApi(spec);
    return null;
  }

  genericFunction(desc) {
    return `\`\`\`js\n/**\n * ${desc}\n */\nfunction processData(input) {\n  // Validate input\n  if (!input || typeof input === 'undefined') {\n    throw new Error('Invalid input');\n  }\n\n  try {\n    // TODO: Implement logic based on: ${desc}\n    const result = input;\n    return result;\n  } catch (err) {\n    console.error('processData error:', err);\n    throw err;\n  }\n}\n\nmodule.exports = { processData };\n\`\`\``;
  }

  genericClass(desc) {
    return `\`\`\`js\n/**\n * ${desc}\n */\nclass Service {\n  constructor(config = {}) {\n    this.config = config;\n    this.initialized = false;\n  }\n\n  async init() {\n    // TODO: Initialization logic\n    this.initialized = true;\n  }\n\n  async execute(params) {\n    if (!this.initialized) await this.init();\n    // TODO: Core logic for: ${desc}\n    return { success: true, data: params };\n  }\n\n  destroy() {\n    this.initialized = false;\n  }\n}\n\nmodule.exports = Service;\n\`\`\``;
  }

  genericApi(desc) {
    return `\`\`\`js\n// API endpoint for: ${desc}\nconst router = require('express').Router();\n\nrouter.get('/', async (req, res) => {\n  try {\n    // TODO: fetch data\n    res.json({ status: 'ok', data: [] });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n});\n\nrouter.post('/', async (req, res) => {\n  try {\n    const body = req.body;\n    // TODO: validate and save\n    res.status(201).json({ id: Date.now(), ...body });\n  } catch (err) {\n    res.status(400).json({ error: err.message });\n  }\n});\n\nmodule.exports = router;\n\`\`\``;
  }

  buildDebugResponse(input) {
    const best = this.kb.map(e => ({ e, s: this.score(input, e) })).sort((a,b) => b.s - a.s)[0];
    const header = `## 🐛 Debug Analysis\n\n**Input analyzed:** "${input.slice(0,80)}..."\n\n`;
    if (best && best.s > 0) return header + best.e.answer;
    return header + `**Steps to debug:**\n1. Check browser console for full stack trace\n2. Add \`console.log\` before the failing line\n3. Verify all variables are defined\n4. Check network tab for API errors\n\nPaste your full error message and I'll give a precise fix!`;
  }

  buildArchitectResponse(input) {
    const best = this.kb.map(e => ({ e, s: this.score(input, e) })).sort((a,b) => b.s - a.s)[0];
    if (best && best.s > 0) return `## 🏛️ Architecture Plan\n\n` + best.e.answer;
    return `## 🏛️ Architecture Plan\n\n**For: "${input.slice(0,60)}"\n\n**Recommended Stack:**\n- **Frontend:** React + TypeScript + Vite\n- **Backend:** Node.js + Express / FastAPI (Python)\n- **Database:** PostgreSQL (relational) or MongoDB (flexible)\n- **Cache:** Redis\n- **Deployment:** Docker + Nginx\n\n**Layers:**\n\`\`\`\n[Client] → [Load Balancer] → [API Server]\n                                    ↓\n                              [Business Logic]\n                                    ↓\n                         [Cache] ← [Database]\n\`\`\`\n\nDescribe your specific requirements for a detailed plan!`;
  }

  buildReviewResponse(input) {
    const issues = [];
    if (/var\s/.test(input)) issues.push('❌ Use `const`/`let` instead of `var`');
    if (/==(?!=)/.test(input)) issues.push('❌ Use `===` strict equality instead of `==`');
    if (/console\.log/.test(input)) issues.push('⚠️ Remove `console.log` before production');
    if (!/(try|catch|error)/.test(input.toLowerCase())) issues.push('⚠️ Add error handling (try/catch)');
    if (!/(\/\/|\/\*)/.test(input)) issues.push('⚠️ Add comments for complex logic');
    if (input.length < 50) issues.push('ℹ️ Too short to review — paste your full code');
    const score = Math.max(1, 10 - issues.length * 2);
    return `## 🔍 Code Review\n\n**Quality Score: ${score}/10**\n\n${issues.length ? issues.join('\n') : '✅ No obvious issues found!'}\n\n**General improvements:**\n- Add input validation\n- Extract magic numbers to constants\n- Consider breaking large functions into smaller ones\n- Add unit tests for business logic`;
  }

  think(input) {
    const q = input.toLowerCase();
    const intent = this.detectIntent(input);
    const activeMode = this.mode !== 'NORMAL' ? this.mode : intent;

    // Build context string from memory
    const contextWords = this.memory.slice(-3).join(' ');

    // Find best KB match, slightly influenced by recent memory context
    const scored = this.kb.map(e => {
      let s = this.score(input, e);
      // Give a tiny bump if context words match tags, making conversations feel connected
      e.tags.forEach(t => { if (contextWords.includes(t)) s += 0.5; });
      return { e, s };
    }).sort((a,b) => b.s - a.s);
    
    const best = scored[0];

    // Mode-specific responses
    let response = '';
    if (activeMode === 'DEBUG') response = this.buildDebugResponse(input);
    else if (activeMode === 'ARCHITECT') response = this.buildArchitectResponse(input);
    else if (activeMode === 'REVIEW') response = this.buildReviewResponse(input);
    
    // Code generation
    else if (/^(write|create|build|generate|make)\s/i.test(input)) {
      const code = this.generateCode(input);
      if (code) response = `## ⚙️ Generated Code\n\nHere's a template for: *${input.slice(0,60)}*\n\n${code}\n\n> Customize the TODO sections for your logic.`;
    }
    
    // KB match
    else if (best && best.s >= 2) {
      response = `## 🧠 Understanding\nYou want to know about **${best.e.tags.slice(0,2).join(', ')}**.\n\n${best.e.answer}\n\n---\n🚀 **Tip:** Switch to a specific mode (DEBUG/ARCHITECT/REVIEW) for focused help!`;
    }
    
    // Research mode
    else if (activeMode === 'RESEARCH') {
      response = `## 🔬 Research: "${input.slice(0,50)}"\n\n**Summary:** This topic requires analysis from multiple angles.\n\n**Key areas to explore:**\n1. Official documentation\n2. Community best practices\n3. Performance benchmarks\n4. Security considerations\n\n**Recommendation:** Start with the official docs, then check GitHub issues for real-world problems.\n\n> I'm a local AI — for deep internet research, connect to Gemini API (🔑 button).`;
    }
    
    // General fallback
    else {
      response = `## 🧠 Elite AI Response\n\nYou asked: *"${input.slice(0,80)}"*\n\n**I can help with:**\n- 💻 Code generation (say "write a function that...")\n- 🐛 Debugging (paste your error message)\n- 🏛️ Architecture (describe your system)\n- 🔍 Code review (paste your code)\n\n**Supported topics:** JavaScript, TypeScript, Python, React, Node.js, SQL, Docker, Git, Algorithms, Design Patterns, Security, C++, Rust, HTML/CSS\n\n**Try asking:**\n- "Write a REST API with Express"\n- "Fix this error: TypeError cannot read..."\n- "Design a chat application architecture"\n- "Review this code: [paste code]"\n\n> 💡 For unlimited AI power, add your Gemini API key (🔑 button) — it's free!`;
    }

    // Save to memory
    this.memory.push(q);
    if (this.memory.length > 5) this.memory.shift();

    return response;
  }

  // --- OTONOM ÖĞRENME (AUTO-LEARNING) & BAĞLAM SIKIŞTIRMA (CONTEXT COMPRESSION) ---
  
  startAutoLearning() {
    // Geniş kodlama dilleri ve teknolojileri listesi
    this.learningTopics = [
      'JavaScript', 'Python', 'Java', 'C++', 'Rust', 'Go', 'PHP', 'Ruby', 'Swift', 'Kotlin', 
      'TypeScript', 'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'GraphQL', 'WebSockets', 
      'Machine Learning', 'React', 'Vue', 'Angular', 'Node.js', 'Spring Boot', 'Django', 
      'Flask', 'Laravel', 'C#', '.NET', 'Unity', 'Unreal Engine', 'WebAssembly', 'Solidity'
    ];
    // Her 15 saniyede bir yeni bir konu öğren (Bilgisayarı dondurmadan asenkron çalışır)
    this.learningInterval = setInterval(() => this.learnNextTopic(), 15000);
    setTimeout(() => this.learnNextTopic(), 2000); // İlk öğrenmeyi 2sn sonra başlat
  }

  async learnNextTopic() {
    if (this.learningTopics.length === 0) {
      // Liste bittiğinde başa dön (sürekli öğrenme loop'u)
      this.learningTopics = ['JavaScript', 'Python', 'C++', 'Rust', 'Go', 'Machine Learning', 'Docker'];
    }
    const topic = this.learningTopics.shift();
    this.updateLearningUI(`Öğreniyor: ${topic}...`);
    
    try {
      // Wikipedia'dan doğrudan veri çekme (CORS destekli, captchasız, hafif API)
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(topic)}&origin=*`);
      const data = await res.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== '-1') {
        const extract = pages[pageId].extract;
        // Bilgi bankasına (KB) yeni öğrendiği bilgiyi ekle
        this.kb.push({
          tags: [topic.toLowerCase(), 'programming', 'language', 'framework', 'tech'],
          answer: `## 📚 ${topic} (Otonom Öğrenildi)\n\n${extract.substring(0, 600)}...\n\n*Not: Bu bilgi AI tarafından arka planda internetten otonom olarak öğrenilmiştir.*`
        });
        
        this.updateLearningUI(`Öğrenildi: ${topic}`, true);
        
        // Çok fazla bilgi biriktiyse güçlü bağlam sıkıştırmasını tetikle
        this.compressKnowledgeBase();
      } else {
        this.updateLearningUI(`Geçildi: ${topic}`);
      }
    } catch (e) {
      this.updateLearningUI(`Hata: ${topic}`);
    }
  }

  updateLearningUI(text, success=false) {
    const el = document.getElementById('learning-text');
    if (el) {
      el.textContent = text;
      el.parentElement.style.color = success ? '#4ec9b0' : '#dcdcaa';
      // 2 saniye sonra rengi normale çevir
      setTimeout(() => { if (el.parentElement) el.parentElement.style.color = '#4ec9b0'; }, 2000);
    }
  }

  compressKnowledgeBase() {
    const MAX_KB_SIZE = 25; // Hızlı test için eşik düşük tutuldu
    if (this.kb.length <= MAX_KB_SIZE) return;

    // Sadece AI'ın otonom öğrendiği bilgileri filtrele
    const autonomousItems = this.kb.filter(item => item.answer && item.answer.includes('Otonom Öğrenildi'));
    
    // Eğer otonom öğrenilen yeterli öğe varsa, bunları güçlü tek bir bağlama sıkıştır
    if (autonomousItems.length > 5) {
      this.updateLearningUI(`Bağlam Sıkıştırılıyor...`);
      
      // Orjinal/Sabit kuralları koru
      const newKb = this.kb.filter(item => !item.answer || !item.answer.includes('Otonom Öğrenildi'));
      
      const tags = new Set();
      let compressedText = '## 🧠 Sıkıştırılmış Güçlü Bağlam (Core Knowledge)\n\n';
      
      autonomousItems.forEach(item => {
        item.tags.forEach(t => tags.add(t));
        // Sadece en temel 1-2 cümleyi alarak yoğun bir bağlam oluştur
        const firstSentenceMatch = item.answer.match(/(## 📚 .*?\n\n)(.*?)(?:\. |\n)/);
        if (firstSentenceMatch) {
           const topicTitle = item.tags[0].toUpperCase();
           compressedText += `- **${topicTitle}**: ${firstSentenceMatch[2]}.\n`;
        }
      });
      
      compressedText += `\n*Not: Depolama alanını korumak ve hızı artırmak için ${autonomousItems.length} konu tek bir güçlü bağlama sıkıştırıldı. AI artık bunları sezgisel biliyor.*`;
      
      // Sıkıştırılmış veriyi tek bir öğe olarak KB'ye geri ekle
      newKb.push({
        tags: Array.from(tags),
        answer: compressedText
      });
      
      // Hafızayı yenile
      this.kb = newKb;
      
      setTimeout(() => this.updateLearningUI(`Sıkıştırma Başarılı! (Boyut: ${this.kb.length})`, true), 1500);
    }
  }
  // ---------------------------------------------------------------------------------

  async respond(input, onChunk) {
    // Simulate thinking delay for realism
    const response = this.think(input);
    const words = response.split(' ');
    let current = '';
    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? ' ' : '') + words[i];
      if (onChunk) onChunk(words[i] + ' ', current);
      await new Promise(r => setTimeout(r, 8));
    }
    return response;
  }
}

window.localAI = new LocalAI();
