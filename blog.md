---
layout: default
title: "Blog"
permalink: /blog/
---

<span class="page-label">Writing</span>
<h1 class="page-title">Blog Posts</h1>
<p class="page-intro">
  Notes on software, systems, research, and the occasional tangent.
</p>

<div class="search-wrap">
  <input
    type="search"
    class="search-input"
    placeholder="Search posts..."
    aria-label="Search posts"
    id="search-input"
  >
  <div class="search-results" id="search-results"></div>
</div>

{% assign postsByYear = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}

{% for year in postsByYear %}
<p class="year-label">{{ year.name }}</p>
<ul class="item-list">
  {% for post in year.items %}
  <li class="item">
    <div class="item-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </div>
    <div class="item-meta">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      {{ post.date | date: "%B %-d, %Y" }}
      {% if post.read_time %}
      <span class="meta-sep">&middot;</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      {{ post.read_time }} min read
      {% endif %}
    </div>
    {% if post.excerpt %}
    <p class="item-excerpt">{{ post.excerpt | strip_html | truncate: 160 }}</p>
    {% endif %}
    {% if post.tags %}
    <div class="item-tags">
      {% for tag in post.tags %}
      <span class="tag">{{ tag }}</span>
      {% endfor %}
    </div>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endfor %}
