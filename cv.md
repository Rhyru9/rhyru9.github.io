---
layout: default
title: "CV"
permalink: /cv/
---

<span class="page-label">Curriculum Vitae</span>
<h1 class="page-title">CV</h1>

<p style="margin-bottom:var(--sp-8);">
  <a href="/assets/cv.pdf" class="item-link" target="_blank" rel="noopener">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    Download PDF version
  </a>
</p>

## Education & Certifications

<div class="cv-section">
  {% for item in site.data.cv.education %}
  <div class="cv-item">
    <div class="cv-year">{{ item.period }}</div>
    <div class="cv-content">
      <h4>{{ item.degree }}</h4>
      <p class="cv-institution">{{ item.institution }}</p>
      {% if item.description %}<p>{{ item.description }}</p>{% endif %}
    </div>
  </div>
  {% endfor %}
</div>

{% if site.data.cv.certifications %}
## Professional Certifications

<div class="cv-section">
  {% for cert in site.data.cv.certifications %}
  <div class="cv-item">
    <div class="cv-year">{{ cert.date }}</div>
    <div class="cv-content">
      <h4>{{ cert.name }}</h4>
      <p class="cv-institution">{{ cert.issuer }}</p>
    </div>
  </div>
  {% endfor %}
</div>
{% endif %}

## Experience

<div class="cv-section">
  {% for item in site.data.cv.experience %}
  <div class="cv-item">
    <div class="cv-year">{{ item.period }}</div>
    <div class="cv-content">
      <h4>{{ item.title }}</h4>
      <p class="cv-institution">{{ item.company }}</p>
      {% if item.description %}<p>{{ item.description }}</p>{% endif %}
    </div>
  </div>
  {% endfor %}
</div>

## Technical Skills

<div class="cv-section">
  {% for group in site.data.cv.skills %}
  <div class="cv-item">
    <div class="cv-year">{{ group.category }}</div>
    <div class="cv-content">
      <div class="item-tags" style="margin-top:4px;">
        {% for skill in group.items %}
        <span class="tag">{{ skill }}</span>
        {% endfor %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>

---

## Areas of Expertise

**Vulnerability Research**  
Deep understanding of web application vulnerabilities, API security flaws, and authentication/authorization issues.

**Penetration Testing**  
Comprehensive security assessments for web applications, mobile apps, and network infrastructure.

**Security Tool Development**  
Building automation tools for vulnerability discovery and security testing workflows.

**Security Writing**  
Creating detailed vulnerability reports, writeups, and educational content for the security community.