/**
 * P. RAGHAVENDRA - CYBERSECURITY PORTFOLIO SCRIPT
 * Handles:
 * 1. Background Cyber Matrix/Grid Canvas Animation
 * 2. Fully Interactive SOC Terminal Simulator with history
 * 3. Mobile Navigation & UI interactions
 * 4. Clipboard helper & telemetry updates
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initTerminal();
  initMobileNav();
  initClipboard();
});

/* ==========================================================================
   1. CYBER BACKGROUND CANVAS ANIMATION
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.3 ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 255, 157, 0.45)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles within proximity
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. INTERACTIVE TERMINAL SIMULATOR
   ========================================================================== */
function initTerminal() {
  const outputEl = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-input');
  const submitBtn = document.getElementById('terminal-submit-btn');
  const shortcutButtons = document.querySelectorAll('.cmd-pill');

  if (!outputEl || !inputEl) return;

  const commandHistory = [];
  let historyIndex = -1;

  const COMMAND_REGISTRY = {
    help: () => `
[+] AVAILABLE COMMANDS:
  whoami          Display primary security operator profile
  skills          List core technical competencies & toolsets
  vapt-report     Show findings from the live website security audit
  forensics-log   View digital forensic case details & write-blocker notes
  ocr             Inspect details on the LEO AI OCR tool (Ollama + Tesseract)
  tryhackme       Display TryHackMe rankings, room count & credentials
  certifications  List verified industry & Cisco certifications
  education       View academic background & CGPA metrics
  contact         Show secure contact points and dispatch email
  clear           Wipe terminal output screen
    `,

    whoami: () => `
[+] IDENTITY: P. Raghavendra
    Target: Entry-Level SOC Analyst / Security Operations / Junior VAPT
    Location: Hyderabad, India
    Education: B.Tech in Computer Science (Cyber Security), GITAM University
    Focus: Splunk SIEM, Threat Hunting, Live Web Pentesting, Chain-of-Custody DFIR
    Status: Available for immediate hire & deployment
    `,

    skills: () => `
[+] CORE SKILL MATRIX:
    • SIEM & Analysis: Splunk, Wireshark, IDS/IPS Concepts, Incident Response
    • Offensive/VAPT:  Burp Suite, Nmap, Nikto, Feroxbuster, Gobuster, Kali Linux
    • Forensics/DFIR:  FTK Imager, Oxygen Forensics, Write-Blocker Duplicators
    • Scripting:       Python (Scripting, OCR, Ollama integration), SQL, Bash
    • Concepts:        OWASP Top 10, Cross-Site Tracing (XST), Cryptography, Differential Privacy
    `,

    'vapt-report': () => `
[+] TARGET: Authorized Live Production Web Assessment (SCSC)
    • Total Disclosures: 4 Vulnerabilities
    • [HIGH]   Missing SSL Certificate & Unrestricted Root Files (Info Disclosure)
    • [MED]    HTTP TRACE Method Enabled (Susceptible to Cross-Site Tracing / XST)
    • [LOW]    Outdated Server Software Packages & Banner Leaks
    • [LOW]    Unnecessary root asset residual leakage
    • Remediation: Authored prioritized risk matrix for leadership action.
    `,

    'forensics-log': () => `
[+] DIGITAL FORENSICS RESEARCH DOCKET:
    • Target 1: Formatted USB storage media with zero visible files.
      Outcome: Carved raw sector data, successfully recovered deleted photos, emails, and doc artifacts.
    • Target 2: Android mobile endpoint.
      Outcome: Created forensically sound bitstream duplicate via physical write-blocker.
      Artifacts Extracted: Messages, app data, call logs using Oxygen Forensics & FTK Imager.
    • Compliance: 100% adherence to chain of custody and MD5/SHA256 evidence verification.
    `,

    ocr: () => `
[+] LAW ENFORCEMENT OCR & LOCAL LLM TOOL:
    • Problem: Manual case transcriptions taking ~30 mins per document during police station visits.
    • Pipeline: Hybrid macOS Vision + Tesseract OCR fallback with openpyxl/pypdf.
    • Optimization: Slashed processing latency from 30 mins to ~5 mins (~83% reduction) at ~85% accuracy.
    • Privacy Safeguard: Local on-device Ollama LLM copilot prevents sensitive records leaking to cloud.
    `,

    tryhackme: () => `
[+] TRYHACKME STATS:
    • Rank: Top 20% Worldwide
    • Completed Rooms: 34+ Rooms
    • Competencies Tested: Linux Fundamentals, Nmap, Network Services, Web Fundamentals, PrivEsc
    • Profile Link: https://tryhackme.com/p/raghavsai90
    `,

    certifications: () => `
[+] CERTIFICATION CREDENTIALS:
    1. Cisco: Introduction to Cybersecurity
    2. Cisco: Getting Started with Cisco Packet Tracer
    3. Cisco: Python Essentials 1 & 2
    4. Cisco: C for Everyone
    5. Internshala: Ethical Hacking
    6. University of Michigan: Programming for Everybody (Python)
    `,

    education: () => `
[+] ACADEMIC BACKGROUND:
    • B.Tech - Computer Science (Cyber Security) | GITAM University, Hyderabad (2022 - 2026)
      CGPA: 7.5 / 10
    • Intermediate (MPC) | Sri Chaitanya Junior Kalasala (2020 - 2022) | 82.6%
    • Secondary Education (CBSE) | Bharatiya Vidya Bhavan's Public School (2020) | 77%
    `,

    contact: () => `
[+] COMMUNICATION ENDPOINTS:
    • Email: peddentiraghavendra@gmail.com
    • Phone: +91 9392538857
    • LinkedIn: https://www.linkedin.com/in/raghavendra-peddinti-51a759266
    • GitHub: https://github.com/saaaaikrrish
    • TryHackMe: https://tryhackme.com/p/raghavsai90
    `,

    clear: () => '__CLEAR__'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Save to history
    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    // Echo command
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line';
    echoLine.innerHTML = `<span class="prompt">raghavendra@soc:~$</span> <span class="cmd-text">${escapeHtml(rawCmd)}</span>`;
    outputEl.appendChild(echoLine);

    if (cmd === 'clear') {
      outputEl.innerHTML = '';
      return;
    }

    // Lookup command
    let responseText = '';
    if (COMMAND_REGISTRY[cmd]) {
      responseText = COMMAND_REGISTRY[cmd]();
    } else if (cmd === 'ls' || cmd === 'dir') {
      responseText = `achievements.txt   vapt_report.pdf   forensic_hashes.sha256   ocr_copilot.py   certs.pem`;
    } else if (cmd.startsWith('cat ')) {
      const target = cmd.replace('cat ', '').trim();
      responseText = `[+] Reading '${target}': View the detailed cards above for full interactive case data.`;
    } else if (cmd === 'matrix') {
      responseText = `Wake up, Neo... The Matrix has you. Follow the white rabbit. 🐇`;
    } else if (cmd === 'sudo') {
      responseText = `Permission denied: Raghavendra operates with strict principle of least privilege!`;
    } else {
      responseText = `bash: command not found: ${escapeHtml(rawCmd)}. Type 'help' to inspect available security operations commands.`;
    }

    const responseEl = document.createElement('div');
    responseEl.className = 'terminal-line response';
    responseEl.textContent = responseText.trim();
    outputEl.appendChild(responseEl);

    // Auto scroll to bottom
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Handle Enter key
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        inputEl.value = commandHistory[historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputEl.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        inputEl.value = '';
      }
      e.preventDefault();
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const val = inputEl.value;
      inputEl.value = '';
      executeCommand(val);
      inputEl.focus();
    });
  }

  // Hook shortcut command buttons
  shortcutButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        inputEl.focus();
      }
    });
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   4. CLIPBOARD HELPER
   ========================================================================== */
function initClipboard() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', () => {
      const email = 'peddentiraghavendra@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const original = copyText.textContent;
        copyText.textContent = '✓ Copied peddentiraghavendra@gmail.com!';
        copyBtn.style.borderColor = 'var(--cyber-green)';
        copyBtn.style.color = 'var(--cyber-green)';

        setTimeout(() => {
          copyText.textContent = original;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }
}
