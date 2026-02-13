---
layout: default
title: "Achievements"
permalink: /achievements/
---

<span class="page-label">Achievements</span>
<h1 class="page-title">Security Achievements</h1>
<p class="page-intro">
  A collection of vulnerabilities discovered, bounties earned, talks delivered, and contributions to the security community.
</p>

{% assign achievements = site.data.achievements %}

{% if achievements.bug_bounties %}
## Notable Bug Bounties

<ul class="item-list">
  {% for item in achievements.bug_bounties %}
  <li class="item">
    <div class="item-title">{{ item.title }}</div>
    <div class="item-meta">
      <strong>{{ item.severity }}</strong> · {{ item.program }} · {{ item.date }}
      {% if item.bounty %}
      <span class="meta-sep">&middot;</span>
      <strong style="color: var(--accent-warm);">{{ item.bounty }}</strong>
      {% endif %}
    </div>
    {% if item.description %}
    <p class="item-excerpt">{{ item.description }}</p>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endif %}

{% if achievements.awards %}
## Awards & Recognition

<ul class="item-list">
  {% for item in achievements.awards %}
  <li class="item">
    <div class="item-title">
      {% if item.url %}
      <a href="{{ item.url }}" target="_blank" rel="noopener">{{ item.title }}</a>
      {% else %}
      {{ item.title }}
      {% endif %}
    </div>
    <div class="item-meta">{{ item.date }}{% if item.venue %} &middot; {{ item.venue }}{% endif %}</div>
    {% if item.description %}
    <p class="item-excerpt">{{ item.description }}</p>
    {% endif %}
    {% if item.tags %}
    <div class="item-tags">
      {% for tag in item.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
    </div>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endif %}

{% if achievements.publications %}
## Research & Publications

<ul class="item-list">
  {% for item in achievements.publications %}
  <li class="item">
    <div class="item-title">
      {% if item.url %}
      <a href="{{ item.url }}" target="_blank" rel="noopener">{{ item.title }}</a>
      {% else %}
      {{ item.title }}
      {% endif %}
    </div>
    <div class="item-meta">
      Published at <em>{{ item.venue }}</em>{% if item.date %}, {{ item.date }}{% endif %}
    </div>
    {% if item.description %}
    <p class="item-excerpt">{{ item.description }}</p>
    {% endif %}
    <div class="item-links">
      {% if item.paper_url %}
      <a href="{{ item.paper_url }}" class="item-link" target="_blank" rel="noopener">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Read Paper
      </a>
      {% endif %}
      {% if item.slides_url %}
      <a href="{{ item.slides_url }}" class="item-link" target="_blank" rel="noopener">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        View Slides
      </a>
      {% endif %}
    </div>
  </li>
  {% endfor %}
</ul>
{% endif %}

{% if achievements.talks %}
## Conference Talks & Workshops

<ul class="item-list">
  {% for item in achievements.talks %}
  <li class="item">
    <div class="item-title">
      {% if item.url %}
      <a href="{{ item.url }}" target="_blank" rel="noopener">{{ item.title }}</a>
      {% else %}
      {{ item.title }}
      {% endif %}
    </div>
    <div class="item-meta">{{ item.date }}{% if item.venue %} &middot; {{ item.venue }}{% endif %}</div>
    {% if item.description %}
    <p class="item-excerpt">{{ item.description }}</p>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endif %}

---

## Bug Bounty Profiles

Find me on various bug bounty platforms:

- **HackerOne**: [@rhyru9](https://hackerone.com/rhyru9) — Top 10 Researcher
- **Bugcrowd**: [@rhyru9](https://bugcrowd.com/rhyru9) — Elite Researcher
- **Intigriti**: [@rhyru9](https://intigriti.com/researcher/rhyru9)
- **YesWeHack**: [@rhyru9](https://yeswehack.com/hunters/rhyru9)

Total bounties earned: **$xx.xxx+** across all platforms.