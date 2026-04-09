---
layout: default
title: "About"
permalink: /
---

<span class="page-label">About</span>
<h1 class="page-title">Rhyru9</h1>
<p class="page-intro">
  I'm a bug bounty hunter and security researcher specializing in web application security, 
  API testing, and vulnerability discovery. Focused on responsible disclosure and helping 
  organizations build more secure systems.
</p>

---

## About Me

I hunt vulnerabilities through responsible disclosure programs. My focus is on finding security flaws 
in web applications and APIs — from critical authentication bypasses to business logic vulnerabilities 
that could impact user security.

My approach combines systematic testing methodologies with creative problem-solving. Security research 
isn't just about running automated tools — it's about understanding application logic, identifying 
edge cases, and thinking like both a developer and an attacker.

When I'm not testing applications, I'm learning new techniques, contributing to the security community, 
and documenting my findings through technical writeups.

---

## What I Do

Currently focused on:

- **Bug Bounty Hunting** — Finding and responsibly disclosing vulnerabilities through platforms like HackerOne and YesWeHack
- **Security Research** — Exploring web application vulnerabilities, API security flaws, and authentication mechanisms
- **Technical Documentation** — Writing detailed vulnerability reports and security advisories
- **Continuous Learning** — Participating in CTF competitions and security training platforms

---

## Highlights

<div class="stats-row">
  <div class="stat-card">
    <div class="stat-number">200+</div>
    <div class="stat-label">valid vulnerabilities discovered</div>
  </div>
  <div class="stat-card">
    <div class="stat-number">5+</div>
    <div class="stat-label">Hall of Fame recognitions</div>
  </div>
  <div class="stat-card">
    <div class="stat-number">10+</div>
    <div class="stat-label">government certificates</div>
  </div>
</div>

---

## Specializations

**Web Application Security**  
XSS, SQL Injection, Authentication Bypass, Authorization Issues, SSRF, XXE, IDOR, Business Logic Flaws

**API Security**  
REST/GraphQL API testing, Authentication mechanisms, Authorization flaws, Rate limiting issues

**Security Research**  
Vulnerability discovery, Exploit development, Security tool automation, Technical writeups

**Responsible Disclosure**  
Working with security teams, Writing comprehensive reports, Following coordinated disclosure practices

---

## Recent Writeups

{% assign recent = site.posts | limit: 3 %}
{% for post in recent %}
<div class="item" style="padding: 1.25rem 0;">
  <div class="item-title">
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </div>
  <div class="item-meta">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    {{ post.date | date: "%B %-d, %Y" }}
    {% if post.read_time %}
    <span class="meta-sep">&middot;</span>
    {{ post.read_time }} min read
    {% endif %}
  </div>
  {% if post.excerpt %}
  <p class="item-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
  {% endif %}
</div>
{% endfor %}

<p style="margin-top:1.5rem;">
  <a href="{{ '/blog/' | relative_url }}">View all writeups &rarr;</a>
</p>

---

## Recognition

I've been recognized in Hall of Fame programs by:
- **Belgium Government** — CCB Belgium
- **BlackBerry** — Security Acknowledgment
- **Ferrari** — Responsible Disclosure Programme
- **Airship** — Security Recognition
- **Vidio** — Bug Bounty Program

*View complete list of achievements and certificates [here](/achievements/).*

---

## Contact

Interested in security collaboration or have questions about vulnerability disclosure? Feel free to reach out:

- **Email**: rhyfk0z@gmail.com
- **Twitter**: [@rhyru9](https://twitter.com/rhyru9)
- **GitHub**: [rhyru9](https://github.com/rhyru9)
- **HackerOne**: [rhyru9](https://hackerone.com/rhyru9)
- **YesWeHack**: [rhyru9](https://yeswehack.com/hunters/rhyru9)

*Open to security research collaborations and responsible disclosure opportunities.*
